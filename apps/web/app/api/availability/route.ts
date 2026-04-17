import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";
import type {
  AvailabilityForDateDto,
  DateSlotDto,
  DayOfWeek,
} from "@repo/types";

import { availabilityForDateQuerySchema } from "@/lib/validations/availability";
import { fail, handleError, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability?date=YYYY-MM-DD
 *
 * Public-facing endpoint used by `BookingDateTimeField` to decide which
 * slots are bookable on a given date. Algorithm:
 *
 *   1. Reject past dates outright (400).
 *   2. Check `BlockedDate` — if the date is blocked, return the weekly
 *      slots with all `available: false`.
 *   3. Otherwise return the weekly slots for that day-of-week. For *today*
 *      only, mark slots whose start time has already passed as
 *      `available: false, reason: "past"`.
 *
 * We never look at `Booking` records: multiple customers may request the
 * same slot, admin reconciles conflicts manually. (Per scope decision.)
 */
export async function GET(req: NextRequest) {
  try {
    const { date } = availabilityForDateQuerySchema.parse({
      date: req.nextUrl.searchParams.get("date") ?? "",
    });

    // Work in UTC calendar days so the date string round-trips.
    const utcMidnight = new Date(`${date}T00:00:00Z`);
    const today = new Date();
    const todayUtc = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    if (utcMidnight.getTime() < todayUtc.getTime()) {
      return fail("Cannot request availability for a past date", 400);
    }

    // `Date.getDay()` in local time can differ from UTC day for timezones
    // west of UTC near midnight; use UTC to match how we stored the date.
    const dayOfWeek = utcMidnight.getUTCDay() as DayOfWeek;

    const [blocked, slots] = await Promise.all([
      prisma.blockedDate.findUnique({ where: { date: utcMidnight } }),
      prisma.availabilitySlot.findMany({
        where: { dayOfWeek },
        orderBy: { sortKey: "asc" },
      }),
    ]);

    const isToday = utcMidnight.getTime() === todayUtc.getTime();
    const nowMinutes =
      today.getHours() * 60 + today.getMinutes();

    const dateSlots: DateSlotDto[] = slots.map((s) => {
      if (blocked) {
        return { time: s.time, sortKey: s.sortKey, available: false, reason: null };
      }
      if (isToday && s.sortKey <= nowMinutes) {
        return { time: s.time, sortKey: s.sortKey, available: false, reason: "past" };
      }
      return { time: s.time, sortKey: s.sortKey, available: true, reason: null };
    });

    const payload: AvailabilityForDateDto = {
      date,
      dayOfWeek,
      blocked: Boolean(blocked),
      blockedReason: blocked?.reason ?? null,
      slots: dateSlots,
    };

    return ok(payload);
  } catch (err) {
    return handleError(err);
  }
}

// Swallow the unused Prisma import after type-only usage.
void Prisma;
