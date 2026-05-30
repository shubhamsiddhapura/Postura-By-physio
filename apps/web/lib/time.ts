/**
 * Time utilities shared between availability validation and the public
 * availability resolver. Times are user-entered strings like "7:00 AM",
 * "11:30 am", "2:00 PM" — we normalise to the canonical "H:MM AM/PM" form
 * and compute a numeric sortKey (minutes-of-day) so the DB can order
 * slots chronologically without re-parsing on every query.
 */

export type ParsedTime = {
  /** Canonical display form: "7:00 AM", "10:30 PM" */
  display: string;
  /** Minutes since midnight (0..1439) */
  minutes: number;
};

/**
 * Accepts: "7:00 AM", "7:00am", " 11:30 pm ", "12:00 AM" (midnight),
 * "12:00 PM" (noon). Rejects 24h times (use AM/PM) and malformed input.
 */
export function parseDisplayTime(input: string): ParsedTime | null {
  const match = input.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let h = Number(match[1]);
  const m = Number(match[2]);
  const period = match[3].toUpperCase() as "AM" | "PM";

  if (h < 1 || h > 12) return null;
  if (m < 0 || m > 59) return null;

  if (period === "AM" && h === 12) h = 0;
  else if (period === "PM" && h !== 12) h += 12;

  const display = `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${period}`;
  return { display, minutes: h * 60 + m };
}

/** Convert minutes-since-midnight back to display. */
export function formatMinutes(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = ((h24 % 12) || 12);
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
