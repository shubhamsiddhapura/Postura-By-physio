import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import {
  createBookingSchema,
  listBookingsQuerySchema,
} from "@/lib/validations/booking";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeBooking } from "@/lib/api/serializers";
import { getAdminNotifyAddress, sendMail } from "@/lib/mail/mailer";
import {
  adminBookingEmail,
  customerBookingEmail,
} from "@/lib/mail/templates/booking";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings
 * Admin listing. Sorted newest-first (status filter `pending` keeps
 * actionable requests at the top when combined with ?status=pending).
 *
 * Query:
 *   - page / limit        (default 1 / 50, max 200)
 *   - status              "pending" | "confirmed" | "completed" | "cancelled"
 *   - program             "physiotherapy" | "fitness"
 *   - search              matches fullName / phone / email (case-insensitive)
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, status, program, search } =
      listBookingsQuerySchema.parse(params);

    const where: Prisma.BookingWhereInput = {};
    if (status) where.status = status as Prisma.BookingWhereInput["status"];
    if (program)
      where.program = program as Prisma.BookingWhereInput["program"];
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return ok(items.map(serializeBooking), {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/bookings
 * Public-facing endpoint used by `ContactBookingSection`.
 *
 * Mail dispatch is awaited — Vercel serverless freezes the function the
 * moment the response returns, so any un-awaited SMTP send is orphaned
 * mid-flight. `sendMail` swallows its own errors, so awaiting is safe:
 * a failed send still yields a 201 and the booking remains persisted.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createBookingSchema.parse(body);

    const created = await prisma.booking.create({
      data: {
        program: input.program as Prisma.BookingCreateInput["program"],
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        preferredDateTime: input.preferredDateTime,
        preferredDateTimeUtc: new Date(input.preferredDateTimeUtc),
        patientTimezone: input.patientTimezone,
        consultationType: input.consultationType,
        service: input.service,
        address: input.address,
        message: input.message,
        profileAbout: input.profileAbout,
        activityLevel: input.activityLevel,
        discomfortArea: input.discomfortArea,
        possibleCause: input.possibleCause,
      },
    });

    const dto = serializeBooking(created);

    await dispatchBookingEmails(dto);

    return ok(dto, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

async function dispatchBookingEmails(dto: ReturnType<typeof serializeBooking>) {
  const adminAddr = getAdminNotifyAddress();

  const adminTpl = adminBookingEmail(dto);
  await sendMail({
    to: adminAddr,
    subject: adminTpl.subject,
    html: adminTpl.html,
    text: adminTpl.text,
    replyTo: dto.email,
  });

  const customerTpl = customerBookingEmail(dto);
  await sendMail({
    to: dto.email,
    subject: customerTpl.subject,
    html: customerTpl.html,
    text: customerTpl.text,
  });
}
