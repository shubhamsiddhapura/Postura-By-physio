import { NextRequest } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@repo/db";
import type {
  AvailabilityForDateDto,
  DateSlotDto,
  DayOfWeek,
} from "@repo/types";

import { availabilityForDateQuerySchema } from "@/lib/validations/availability";
import { fail, handleError, ok } from "@/lib/api/response";
import {
  clinicSlotToUtc,
  getClinicTimezone,
  isValidTimezone,
} from "@/lib/time/clinic";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability?date=YYYY-MM-DD[&tz=IANA]
 *
 * Public-facing endpoint consumed by `BookingDateTimeField`.
 *
 * - `date` is always interpreted in `tz` when provided (the patient's
 *   browser timezone). When `tz` is omitted we fall back to the clinic
 *   timezone for legacy callers / admin tooling.
 * - Availability is resolved from the clinic-local weekly template +
 *   blocked dates. A patient's local day can span one or two clinic
 *   days, so we union the slots from every overlapping clinic date and
 *   filter down to those whose UTC moment falls inside the patient's
 *   local day window.
 * - Returned `time` is the patient-local display ("11:30 PM") and
 *   `datetimeUtc` is the canonical instant they book.
 *
 * We never look at `Booking` records: multiple customers may request
 * the same slot, admin reconciles conflicts manually.
 */
export async function GET(req: NextRequest) {
  try {
    const { date, tz } = availabilityForDateQuerySchema.parse({
      date: req.nextUrl.searchParams.get("date") ?? "",
      tz: req.nextUrl.searchParams.get("tz") ?? undefined,
    });

    const clinicTz = getClinicTimezone();
    const viewerTz = tz && isValidTimezone(tz) ? tz : clinicTz;

    // Anchor `date` in the viewer's timezone. If the viewer is in the
    // clinic TZ these collapse to the previous behaviour.
    const viewerStart = DateTime.fromISO(date, { zone: viewerTz }).startOf("day");
    if (!viewerStart.isValid) {
      return fail("date is not a real calendar date", 400);
    }
    const viewerEnd = viewerStart.endOf("day");

    // Past-date rejection uses the viewer's clock — someone in Tokyo
    // asking for "today" shouldn't be blocked just because the server
    // thinks it's still yesterday.
    const nowInViewer = DateTime.now().setZone(viewerTz);
    if (viewerStart < nowInViewer.startOf("day")) {
      return fail("Cannot request availability for a past date", 400);
    }

    // The viewer's day can straddle one or two clinic dates. Enumerate
    // every clinic-local calendar day that overlaps the viewer's window.
    const clinicDates: string[] = [];
    let cursor = viewerStart.setZone(clinicTz).startOf("day");
    const lastClinicDay = viewerEnd.setZone(clinicTz).startOf("day");
    while (cursor <= lastClinicDay) {
      clinicDates.push(cursor.toFormat("yyyy-MM-dd"));
      cursor = cursor.plus({ days: 1 });
    }

    // dayOfWeek expected by the DB is JS-style (0=Sun); luxon is 1-Mon..7-Sun.
    const dayOfWeekFor = (isoDate: string): DayOfWeek => {
      const wd = DateTime.fromISO(isoDate, { zone: clinicTz }).weekday;
      return (wd === 7 ? 0 : wd) as DayOfWeek;
    };
    const dowSet = Array.from(
      new Set(clinicDates.map(dayOfWeekFor))
    ) as DayOfWeek[];

    const [blockedRows, slotRows] = await Promise.all([
      prisma.blockedDate.findMany({
        where: {
          date: { in: clinicDates.map((d) => new Date(`${d}T00:00:00Z`)) },
        },
      }),
      prisma.availabilitySlot.findMany({
        where: { dayOfWeek: { in: dowSet } },
        orderBy: { sortKey: "asc" },
      }),
    ]);

    const blockedByDate = new Map<string, (typeof blockedRows)[number]>();
    for (const b of blockedRows) {
      const key = DateTime.fromJSDate(b.date, { zone: "utc" }).toFormat(
        "yyyy-MM-dd"
      );
      blockedByDate.set(key, b);
    }

    const nowUtc = DateTime.utc();
    const dateSlots: DateSlotDto[] = [];
    let anyBlockedReason: string | null = null;
    let anyBlocked = false;

    for (const clinicDate of clinicDates) {
      const dow = dayOfWeekFor(clinicDate);
      const slotsForDow = slotRows.filter((s) => s.dayOfWeek === dow);
      const blocked = blockedByDate.get(clinicDate);
      if (blocked) {
        anyBlocked = true;
        if (!anyBlockedReason) anyBlockedReason = blocked.reason ?? null;
      }

      for (const s of slotsForDow) {
        const slotUtc = clinicSlotToUtc(clinicDate, s.time);
        if (!slotUtc) continue;

        const slotInViewer = slotUtc.setZone(viewerTz);
        // Keep only slots whose moment lands in the viewer's local day.
        if (slotInViewer < viewerStart || slotInViewer > viewerEnd) continue;

        const isPast = slotUtc < nowUtc;
        const isBlocked = Boolean(blocked);
        const available = !isPast && !isBlocked;

        dateSlots.push({
          time: slotInViewer.toFormat("h:mm a"),
          sortKey: slotInViewer.hour * 60 + slotInViewer.minute,
          datetimeUtc: slotUtc.toISO() ?? slotUtc.toString(),
          clinicTime: slotUtc.setZone(clinicTz).toFormat("h:mm a"),
          available,
          reason: !available ? (isPast ? "past" : null) : null,
        });
      }
    }

    dateSlots.sort((a, b) => a.sortKey - b.sortKey);

    // A viewer-date is "blocked" iff every candidate slot it could have
    // shown was from a blocked clinic-date. Empty-list case is kept
    // non-blocked so the client shows "no slots" rather than "closed".
    const effectiveBlocked =
      dateSlots.length > 0 &&
      dateSlots.every((s) => !s.available) &&
      anyBlocked;

    // For the viewer-facing `dayOfWeek` we report the viewer's day, not
    // the clinic's. This keeps the calendar labelling consistent with
    // what the patient clicked.
    const viewerDow = (viewerStart.weekday === 7
      ? 0
      : viewerStart.weekday) as DayOfWeek;

    const payload: AvailabilityForDateDto = {
      date,
      dayOfWeek: viewerDow,
      blocked: effectiveBlocked,
      blockedReason: effectiveBlocked ? anyBlockedReason : null,
      timezone: viewerTz,
      clinicTimezone: clinicTz,
      slots: dateSlots,
    };

    return ok(payload);
  } catch (err) {
    return handleError(err);
  }
}
