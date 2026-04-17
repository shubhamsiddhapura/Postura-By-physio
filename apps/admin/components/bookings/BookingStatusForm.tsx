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

  // Split the stored display string into a date input value + free-form time
  // for editing. Falls back gracefully if parsing fails (rare legacy rows).
  const initial = useMemo(
    () => parsePreferredDateTime(booking.preferredDateTime),
    [booking.preferredDateTime]
  );

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [dateISO, setDateISO] = useState(initial.dateISO);
  const [time, setTime] = useState(initial.time);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const composedPreferred = useMemo(
    () => composePreferredDateTime(dateISO, time),
    [dateISO, time]
  );

  const statusDirty = status !== booking.status;
  const notesDirty = (notes.trim() || null) !== booking.notes;
  const dateDirty =
    composedPreferred != null && composedPreferred !== booking.preferredDateTime;
  const isDirty = statusDirty || notesDirty || dateDirty;

  // Block save when the user cleared the time field — preferredDateTime is
  // required. Empty "time" / unparseable date => composedPreferred === null.
  const scheduleInvalid = !composedPreferred;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!composedPreferred) {
      setError("Please provide both a date and a time.");
      return;
    }

    const payload: UpdateBookingDto = {};
    if (statusDirty) payload.status = status;
    if (notesDirty) payload.notes = notes.trim() === "" ? null : notes.trim();
    if (dateDirty) payload.preferredDateTime = composedPreferred;

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
                {booking.preferredDateTime}
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
/* preferredDateTime <-> (dateISO, time) helpers                      */
/* ------------------------------------------------------------------ */

/**
 * Booking.preferredDateTime is stored as a display string built by the
 * public calendar (e.g. "Apr 22, 2026, 10:00 AM"). To make it editable we
 * split it into a YYYY-MM-DD date value (for the native date input) and
 * a free-form time string.
 *
 * Best-effort parse — falls back to "today" + the raw value if the format
 * is unexpected (legacy rows, hand-edited entries).
 */
function parsePreferredDateTime(raw: string): { dateISO: string; time: string } {
  const trimmed = raw.trim();

  // Expected form: "<locale date>, <time>"  — split on the LAST comma so
  // dates like "Apr 22, 2026" (which contain their own comma) stay intact.
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

/**
 * Build the canonical display string from editor state. Returns `null`
 * when either piece is missing / invalid so the form can block save.
 */
function composePreferredDateTime(dateISO: string, time: string): string | null {
  const cleanTime = time.trim();
  if (!cleanTime) return null;

  // dateISO comes from <input type="date">, always "YYYY-MM-DD" when set.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const date = new Date(y, m, d);
  if (Number.isNaN(date.getTime())) return null;

  const displayDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${displayDate}, ${cleanTime}`;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
