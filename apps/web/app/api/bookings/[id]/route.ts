import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";
import type { BookingDto } from "@repo/types";

import { updateBookingSchema } from "@/lib/validations/booking";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeBooking } from "@/lib/api/serializers";
import { sendMail } from "@/lib/mail/mailer";
import {
  customerCancelledEmail,
  customerConfirmedEmail,
  customerRescheduledEmail,
} from "@/lib/mail/templates/booking";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/** GET /api/bookings/:id */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });
    if (!booking) return fail("Booking not found", 404);
    return ok(serializeBooking(booking));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/bookings/:id
 *
 * Admin-only workflow fields:
 *   - `status`              confirm / cancel / complete the booking
 *   - `notes`               internal-only notes (no email)
 *   - `preferredDateTime`   reshuffle after phone confirmation with patient
 *
 * Customer identity / contact / questionnaire fields remain immutable —
 * source of truth is what the customer submitted.
 *
 * Side-effect: fires a customer-facing email based on what actually changed.
 * Rules (after this PATCH resolves):
 *   - status transitioned to `confirmed`              → confirmation email
 *     (uses the new `preferredDateTime` if also changed)
 *   - status transitioned to `cancelled`              → cancellation email
 *   - `preferredDateTime` changed with status unchanged
 *     or still `pending`                              → reschedule email
 *   - `completed` / notes-only edits                  → no email
 * Fire-and-forget: a failed SMTP send never fails the PATCH.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = updateBookingSchema.parse(body);

    const existing = await prisma.booking.findUnique({
      where: { id: params.id },
    });
    if (!existing) return fail("Booking not found", 404);

    const data: Prisma.BookingUpdateInput = {};
    if (input.status !== undefined)
      data.status = input.status as Prisma.BookingUpdateInput["status"];
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.preferredDateTime !== undefined)
      data.preferredDateTime = input.preferredDateTime;
    if (input.preferredDateTimeUtc !== undefined)
      data.preferredDateTimeUtc = new Date(input.preferredDateTimeUtc);

    if (Object.keys(data).length === 0) {
      return fail("No updatable fields provided", 400);
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data,
    });

    const before = serializeBooking(existing);
    const after = serializeBooking(updated);

    // Must await — Vercel serverless can terminate the function as soon as
    // we return, orphaning any in-flight SMTP send. sendMail swallows its
    // own errors, so awaiting never fails the PATCH.
    await dispatchStatusEmails(before, after);

    return ok(after);
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE /api/bookings/:id */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.booking.delete({ where: { id: params.id } });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * Decide which customer email (if any) to send based on the diff between
 * the previous and current booking state. We only ever send one email per
 * PATCH — if the admin confirmed and rescheduled in the same save, the
 * confirmation wins because it already carries the new time.
 */
async function dispatchStatusEmails(
  before: BookingDto,
  after: BookingDto
): Promise<void> {
  const statusChanged = before.status !== after.status;
  // Canonical compare: UTC changed OR (legacy) string changed.
  const utcChanged =
    (before.preferredDateTimeUtc ?? null) !==
    (after.preferredDateTimeUtc ?? null);
  const stringChanged = before.preferredDateTime !== after.preferredDateTime;
  const dateChanged = utcChanged || stringChanged;

  // Priority 1: status → cancelled
  if (statusChanged && after.status === "cancelled") {
    const tpl = customerCancelledEmail(after);
    await sendMail({
      to: after.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return;
  }

  // Priority 2: status → confirmed (covers "also rescheduled in same save")
  if (statusChanged && after.status === "confirmed") {
    const tpl = customerConfirmedEmail(after);
    await sendMail({
      to: after.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return;
  }

  // Priority 3: only the date/time changed (status untouched or still pending)
  if (dateChanged) {
    const tpl = customerRescheduledEmail(before, after);
    await sendMail({
      to: after.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    return;
  }

  // Otherwise (notes-only, completed, etc.) — no email.
}
