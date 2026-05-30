import { DateTime } from "luxon";

/**
 * Timezone the clinic actually operates in. All `AvailabilitySlot` rows
 * (day-of-week + wall-clock time) are interpreted as clinic-local, so we
 * must know this TZ to resolve a recurring slot to a concrete UTC moment.
 *
 * Override with `CLINIC_TIMEZONE` env var if the clinic ever relocates.
 */
export function getClinicTimezone(): string {
  const raw = process.env.CLINIC_TIMEZONE?.trim();
  if (raw && DateTime.local().setZone(raw).isValid) return raw;
  return "Asia/Kolkata";
}

/**
 * True if the given string is a known IANA timezone identifier.
 * Luxon treats invalid zones as invalid DateTime instances, so we just
 * ask it.
 */
export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    return DateTime.now().setZone(tz).isValid;
  } catch {
    return false;
  }
}

/**
 * Parse a display time in the format our admin uses ("10:00 AM", "7:30 PM")
 * and return { hour, minute } in 24-hour time. Returns null on failure.
 */
export function parseDisplayTime(
  time: string
): { hour: number; minute: number } | null {
  const match = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i.exec(time);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

/**
 * Combine a YYYY-MM-DD date + display time ("10:00 AM") interpreted in
 * the clinic's timezone into a UTC instant. Returns null if inputs are
 * unparseable.
 */
export function clinicSlotToUtc(
  date: string,
  time: string
): DateTime | null {
  const parts = parseDisplayTime(time);
  if (!parts) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;

  const dt = DateTime.fromObject(
    { year: y, month: m, day: d, hour: parts.hour, minute: parts.minute },
    { zone: getClinicTimezone() }
  );
  if (!dt.isValid) return null;
  return dt.toUTC();
}

/**
 * Format a UTC ISO string in the target zone as e.g.
 *   "Apr 22, 2026, 10:00 AM"
 * matching the free-form display our UI has used historically.
 */
export function formatInZone(utcIso: string, timezone: string): string {
  const dt = DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone);
  if (!dt.isValid) return utcIso;
  return dt.toFormat("LLL d, yyyy, h:mm a");
}

/**
 * Just the time portion — "10:00 AM".
 */
export function formatTimeInZone(utcIso: string, timezone: string): string {
  const dt = DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone);
  if (!dt.isValid) return "";
  return dt.toFormat("h:mm a");
}

/** Minutes from midnight in the given zone (used for stable slot sorting). */
export function minutesOfDayInZone(utcIso: string, timezone: string): number {
  const dt = DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone);
  if (!dt.isValid) return 0;
  return dt.hour * 60 + dt.minute;
}
