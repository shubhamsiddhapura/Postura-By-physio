import type { BookingDto, BookingStatus } from "@repo/types";

/** Map booking status to a Badge tone for consistent styling admin-wide. */
export const BOOKING_STATUS_TONE: Record<
  BookingStatus,
  "amber" | "blue" | "green" | "red"
> = {
  pending: "amber",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
};

type BookingTimeFields = Pick<
  BookingDto,
  "preferredDateTime" | "preferredDateTimeUtc" | "patientTimezone"
>;

/**
 * Render a booking's time in the viewer's *browser* timezone.
 *
 * Intentionally passes `undefined` as the locale so `toLocaleString`
 * picks up whatever timezone the admin's machine reports — an admin in
 * Mumbai sees IST, an admin travelling to NYC sees ET. Falls back to
 * the stored display string for rows that predate timezone support.
 */
export function formatBookingTime(
  b: BookingTimeFields,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!b.preferredDateTimeUtc) return b.preferredDateTime;
  const d = new Date(b.preferredDateTimeUtc);
  if (Number.isNaN(d.getTime())) return b.preferredDateTime;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  });
}

/** Compact time-only render for tight table cells. */
export function formatBookingTimeShort(b: BookingTimeFields): string {
  return formatBookingTime(b, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Human-friendly label for the patient's original timezone, e.g.
 *   "America/New_York · 11:30 PM local".
 * Returns `null` when we don't have the patient's TZ or when it matches
 * the admin's browser TZ (no point showing redundant info).
 */
export function patientTimezoneHint(b: BookingTimeFields): string | null {
  if (!b.preferredDateTimeUtc || !b.patientTimezone) return null;
  const adminTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (adminTz === b.patientTimezone) return null;
  try {
    const patientLocal = new Date(b.preferredDateTimeUtc).toLocaleString(
      undefined,
      {
        timeZone: b.patientTimezone,
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }
    );
    return `${b.patientTimezone} · ${patientLocal} local`;
  } catch {
    return b.patientTimezone;
  }
}
