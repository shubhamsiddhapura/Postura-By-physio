"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Save } from "lucide-react";
import type { BookingDto, BookingStatus, UpdateBookingDto } from "@repo/types";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError, bookingsApi } from "@/lib/api";
import { BookingTime } from "@/components/bookings/BookingTime";

/**
 * Admin-only editor for the mutable workflow fields on a booking:
 *   - Reschedule (date + time) — reshuffle after phone call with patient
 *   - Status                   — confirm / cancel / complete
 *   - Internal notes           — private to admin
 *
 * Saving dispatches a single customer-facing email based on what changed
 * (see PATCH /api/bookings/:id for the transition rules).
 */
export function BookingStatusForm({ booking }: { booking: BookingDto }) {
  const router = useRouter();

  // Initialise the editor from the canonical UTC when available — this
  // ensures the date/time inputs are rendered in the admin's own browser
  // timezone. Legacy rows without UTC fall back to parsing the display
  // string.
  const initial = useMemo(
    () => initialEditorValues(booking),
    [booking.preferredDateTime, booking.preferredDateTimeUtc]
  );

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [dateISO, setDateISO] = useState(initial.dateISO);
  const [time, setTime] = useState(initial.time);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Compose editor state -> { display, utcIso }. `display` is rendered
  // in the admin's own timezone; `utcIso` is the canonical moment. Both
  // are null when the user has left the time blank or typed garbage.
  const composed = useMemo(
    () => composeEditorValues(dateISO, time),
    [dateISO, time]
  );

  const statusDirty = status !== booking.status;
  const notesDirty = (notes.trim() || null) !== booking.notes;
  const utcDirty =
    composed != null &&
    composed.utcIso !==
      (booking.preferredDateTimeUtc
        ? new Date(booking.preferredDateTimeUtc).toISOString()
        : null);
  const isDirty = statusDirty || notesDirty || utcDirty;

  // Block save when the user cleared the time field — preferredDateTime is
  // required. Empty "time" / unparseable time => composed === null.
  const scheduleInvalid = !composed;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!composed) {
      setError("Please provide both a date and a time (e.g. 10:00 AM).");
      return;
    }

    const payload: UpdateBookingDto = {};
    if (statusDirty) payload.status = status;
    if (notesDirty) payload.notes = notes.trim() === "" ? null : notes.trim();
    if (utcDirty) {
      payload.preferredDateTimeUtc = composed.utcIso;
      payload.preferredDateTime = composed.display;
    }

    startTransition(async () => {
      try {
        await bookingsApi.update(booking.id, payload);
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to update booking"
        );
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              <CalendarClock className="h-3.5 w-3.5" />
              Reschedule
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Change the date or time after confirming with the patient by phone.
              Saving will email the patient the new slot.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
              <div>
                <Label htmlFor="booking-date">Date</Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={dateISO}
                  onChange={(e) => setDateISO(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="booking-time">Time</Label>
                <Input
                  id="booking-time"
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="mt-1.5"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Currently:{" "}
              <span className="font-medium text-gray-700">
                <BookingTime booking={booking} showPatientHint={false} />
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <Label>Status</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BOOKING_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
                    (status === s
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300")
                  }
                >
                  {BOOKING_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Marking <em>Confirmed</em> or <em>Cancelled</em> emails the patient
              automatically.
            </p>
          </div>

          <div>
            <Label htmlFor="booking-notes">Internal notes</Label>
            <Textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Only visible in the admin dashboard."
              className="mt-2"
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {saved && !isDirty ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Changes saved.
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              size="sm"
              type="submit"
              disabled={isPending || !isDirty || scheduleInvalid}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Editor <-> UTC helpers                                             */
/* ------------------------------------------------------------------ */

/**
 * Seed the reschedule inputs.
 *
 * When we have a canonical UTC we project it into the admin's *browser*
 * timezone so editing is WYSIWYG for whoever opened the page. Legacy
 * rows without UTC fall back to parsing the stored display string.
 */
function initialEditorValues(b: BookingDto): { dateISO: string; time: string } {
  if (b.preferredDateTimeUtc) {
    const d = new Date(b.preferredDateTimeUtc);
    if (!Number.isNaN(d.getTime())) {
      return {
        dateISO: toISODate(d),
        time: formatTime12h(d),
      };
    }
  }
  return parsePreferredDateTime(b.preferredDateTime);
}

function parseTime12h(raw: string): { hour: number; minute: number } | null {
  const match = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i.exec(raw);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const mer = match[3].toUpperCase();
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  if (mer === "PM" && hour !== 12) hour += 12;
  if (mer === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

function formatTime12h(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Compose editor state into `{ display, utcIso }`.
 *
 * The interpretation: the admin typed a date + "10:00 AM" meaning "10 AM
 * on my own clock". We instantiate a Date with that wall-clock (in the
 * admin's browser TZ) and read `.toISOString()` for the canonical UTC.
 *
 * Returns null when either piece is missing or unparseable so the form
 * can block save.
 */
function composeEditorValues(
  dateISO: string,
  time: string
): { display: string; utcIso: string } | null {
  const parts = parseTime12h(time);
  if (!parts) return null;
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!dateMatch) return null;
  const y = Number(dateMatch[1]);
  const m = Number(dateMatch[2]) - 1;
  const d = Number(dateMatch[3]);
  const local = new Date(y, m, d, parts.hour, parts.minute, 0, 0);
  if (Number.isNaN(local.getTime())) return null;

  const displayDate = local.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    display: `${displayDate}, ${time.trim()}`,
    utcIso: local.toISOString(),
  };
}

function parsePreferredDateTime(raw: string): { dateISO: string; time: string } {
  const trimmed = raw.trim();
  const lastComma = trimmed.lastIndexOf(",");
  if (lastComma > -1) {
    const datePart = trimmed.slice(0, lastComma).trim();
    const timePart = trimmed.slice(lastComma + 1).trim();
    const parsed = new Date(datePart);
    if (!Number.isNaN(parsed.getTime())) {
      return { dateISO: toISODate(parsed), time: timePart };
    }
  }
  return { dateISO: toISODate(new Date()), time: trimmed };
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
