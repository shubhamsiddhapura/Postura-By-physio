"use client";

import { useEffect, useState } from "react";
import type { BookingDto } from "@repo/types";

type BookingTimeFields = Pick<
  BookingDto,
  "preferredDateTime" | "preferredDateTimeUtc" | "patientTimezone"
>;

type BookingTimeProps = {
  booking: BookingTimeFields;
  /** Compact formatting used in dense tables. */
  compact?: boolean;
  /**
   * When true, renders a secondary line showing the patient's local time
   * if the patient picked in a different timezone.
   */
  showPatientHint?: boolean;
  className?: string;
};

/**
 * Renders a booking's time in the *viewer's* browser timezone.
 *
 * Server-side rendering would pin the output to whatever zone the Node
 * runtime reports (UTC on Vercel), which is never what any admin wants
 * to see. We intentionally render the stored display string on first
 * paint and swap it for the browser-local string after mount — no
 * hydration mismatch, and the first paint still shows something
 * readable for admins on legacy rows.
 */
export function BookingTime({
  booking,
  compact = false,
  showPatientHint = true,
  className,
}: BookingTimeProps) {
  const [clientTime, setClientTime] = useState<string | null>(null);
  const [patientHint, setPatientHint] = useState<string | null>(null);

  useEffect(() => {
    if (!booking.preferredDateTimeUtc) return;
    const d = new Date(booking.preferredDateTimeUtc);
    if (Number.isNaN(d.getTime())) return;

    const opts: Intl.DateTimeFormatOptions = compact
      ? {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      : {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        };
    setClientTime(d.toLocaleString(undefined, opts));

    if (!showPatientHint || !booking.patientTimezone) return;
    try {
      const adminTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (adminTz === booking.patientTimezone) return;
      const patientLocal = d.toLocaleString(undefined, {
        timeZone: booking.patientTimezone,
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      });
      setPatientHint(`${booking.patientTimezone} · ${patientLocal} local`);
    } catch {
      setPatientHint(booking.patientTimezone);
    }
  }, [
    booking.preferredDateTimeUtc,
    booking.patientTimezone,
    compact,
    showPatientHint,
  ]);

  const primary = clientTime ?? booking.preferredDateTime;

  if (!patientHint) {
    return <span className={className}>{primary}</span>;
  }

  return (
    <span className={className}>
      <span className="block">{primary}</span>
      <span className="block text-[11px] text-gray-400">{patientHint}</span>
    </span>
  );
}
