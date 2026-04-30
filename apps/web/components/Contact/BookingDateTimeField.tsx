"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityForDateDto, DateSlotDto } from "@repo/types";
import { cn } from "../../lib/utils";

// `useLayoutEffect` warns during SSR. The popover only ever opens after a user
// click on the client, but we still alias to `useEffect` server-side so Next's
// hydration pass stays clean.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Public-facing selection payload. The patient picks in their own timezone
 * and we hand both the canonical UTC and the TZ the display was rendered in
 * to the parent form, which POSTs all three to /api/bookings.
 */
export type BookingSelection = {
  display: string;
  datetimeUtc: string;
  timezone: string;
};

/** Detect the browser's IANA timezone, with a safe fallback. */
function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && typeof tz === "string") return tz;
  } catch {
    // swallow — some older browsers may not expose resolvedOptions
  }
  return "UTC";
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date) {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() < b.getFullYear();
  if (a.getMonth() !== b.getMonth()) return a.getMonth() < b.getMonth();
  return a.getDate() < b.getDate();
}

/** Convert a local Date to a YYYY-MM-DD key (no timezone shift). */
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildCalendarCells(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = 0; i < firstDow; i++) {
    const day = lastPrev - firstDow + 1 + i;
    cells.push({ date: new Date(year, month - 1, day), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay), inMonth: false });
    nextDay += 1;
  }
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, nextDay), inMonth: false });
    nextDay += 1;
  }
  return cells;
}

function formatSelection(date: Date, time: string) {
  const d = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${d}, ${time}`;
}

type BookingDateTimeFieldProps = {
  id?: string;
  /** Display text currently shown in the closed input. */
  value: string;
  /** Fired when the patient picks a slot — carries UTC + their TZ. */
  onChange: (selection: BookingSelection) => void;
  className?: string;
  inputClassName?: string;
};

type AvailabilityState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: AvailabilityForDateDto }
  | { status: "error"; message: string };

export function BookingDateTimeField({
  id: idProp,
  value,
  onChange,
  className,
  inputClassName,
}: BookingDateTimeFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // The form is wrapped in `FadeIn` components that apply `transform` to
  // their wrapper. A non-`none` transform on an ancestor turns that element
  // into the containing block for `position: fixed` descendants, which would
  // misalign the popover against the viewport. We therefore portal the
  // popover into `document.body` and track that we've mounted client-side.
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    mode: "mobile" | "desktop";
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // IANA timezone of the patient's browser. Captured once per mount — we
  // pass it to /api/availability so the server returns slots rendered for
  // this patient, and forward it back to the form on submit.
  const timezone = useMemo(() => detectTimezone(), []);

  // `today` is fixed for the lifetime of the component — refreshing across
  // midnight is not worth the complexity for a booking form.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(() => new Date(today));
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Disable the prev-month button when it would cross today — avoids
  // showing entirely-disabled months.
  const canGoPrev = useMemo(() => {
    const firstOfView = new Date(year, month, 1);
    const firstOfToday = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstOfView.getTime() > firstOfToday.getTime();
  }, [year, month, today]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      // The popover lives in a portal, so checking `containerRef` alone
      // would treat clicks inside it as "outside". Check both.
      if (containerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Position the popover using fixed coordinates so it renders above other
  // content. Because we portal into `document.body`, fixed positioning here
  // is truly relative to the viewport (transformed ancestors no longer
  // affect us). On phones we render as a centered modal sheet; on tablet+
  // we anchor below (or above, when there isn't room) the trigger button.
  useIsoLayoutEffect(() => {
    if (!open) return;

    const update = () => {
      const btn = triggerRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const padding = 12;
      const gap = 8;

      if (viewportW < 768) {
        // Mobile: centered modal sheet. We size to the screen (minus a small
        // gutter) and cap height so the calendar can scroll internally rather
        // than overflowing the viewport.
        const width = Math.min(440, viewportW - padding * 2);
        const left = Math.max(padding, Math.round((viewportW - width) / 2));
        const desiredHeight = 600;
        const maxAvailable = viewportH - padding * 2;
        const top = Math.max(
          padding,
          Math.round((viewportH - Math.min(desiredHeight, maxAvailable)) / 2),
        );
        const maxHeight = Math.max(280, viewportH - top - padding);
        setPopoverPos({ top, left, width, maxHeight, mode: "mobile" });
        return;
      }

      // Desktop: anchor relative to the trigger.
      const desiredWidth = 560;
      const width = Math.min(desiredWidth, Math.max(320, viewportW - padding * 2));
      let left = r.left;
      if (left + width > viewportW - padding) left = viewportW - padding - width;
      if (left < padding) left = padding;

      // Prefer placing below the trigger; flip above when there isn't enough
      // room and the space above is bigger.
      const estimatedHeight = 440;
      const spaceBelow = viewportH - r.bottom - gap - padding;
      const spaceAbove = r.top - gap - padding;
      let top: number;
      let maxHeight: number;
      if (spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove) {
        top = r.bottom + gap;
        maxHeight = Math.max(280, spaceBelow);
      } else {
        maxHeight = Math.max(280, spaceAbove);
        top = Math.max(padding, r.top - gap - maxHeight);
      }

      setPopoverPos({ top, left, width, maxHeight, mode: "desktop" });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // Lock body scroll while the mobile sheet is up so background content
  // can't slide around behind the modal.
  useEffect(() => {
    if (!open || popoverPos?.mode !== "mobile") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, popoverPos?.mode]);

  // Refetch availability whenever the picked date changes. Abort pending
  // requests so stale responses can't overwrite a newer selection.
  useEffect(() => {
    if (!pickedDate) {
      setAvailability({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setAvailability({ status: "loading" });
    const key = toDateKey(pickedDate);
    const qs = new URLSearchParams({ date: key, tz: timezone }).toString();

    fetch(`/api/availability?${qs}`, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) {
          throw new Error(json?.error ?? `Request failed (${res.status})`);
        }
        setAvailability({ status: "loaded", data: json.data as AvailabilityForDateDto });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setAvailability({
          status: "error",
          message: err instanceof Error ? err.message : "Could not load slots",
        });
      });

    return () => controller.abort();
  }, [pickedDate, timezone]);

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const onPickDate = (date: Date) => {
    if (isBeforeDay(date, today)) return;
    setPickedDate(date);
    setPickedTime(null);
  };

  const onPickTime = (slot: DateSlotDto) => {
    if (!pickedDate || !slot.available) return;
    setPickedTime(slot.time);
    onChange({
      display: formatSelection(pickedDate, slot.time),
      datetimeUtc: slot.datetimeUtc,
      timezone,
    });
    close();
  };

  const displayValue = value;

  // Slots for the picked date, or empty if nothing picked yet.
  const slots: DateSlotDto[] =
    availability.status === "loaded" ? availability.data.slots : [];
  const isBlocked =
    availability.status === "loaded" && availability.data.blocked;
  const blockedReason =
    availability.status === "loaded" ? availability.data.blockedReason : null;
  const hasAnySlots = slots.length > 0;
  const hasAvailableSlot = slots.some((s) => s.available);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        ref={triggerRef}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center rounded-full border border-gray-200 bg-[#fafafa] px-4 pr-11 text-left text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary",
          !displayValue && "text-gray-400",
          inputClassName,
        )}
      >
        <span className="truncate">{displayValue || "Select a date & time"}</span>
      </button>
      <Calendar
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden
      />

      {mounted && open && popoverPos
        ? createPortal(
            <>
              {popoverPos.mode === "mobile" ? (
                <div
                  className="fixed inset-0 z-[199] bg-black/40"
                  onClick={close}
                  aria-hidden
                />
              ) : null}
              <div
                ref={popoverRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-title`}
                style={{
                  top: popoverPos.top,
                  left: popoverPos.left,
                  width: popoverPos.width,
                  maxHeight: popoverPos.maxHeight,
                }}
                className="fixed z-[200] overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
            {/* Calendar — left, primary width */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 id={`${id}-title`} className="text-base font-bold text-gray-900">
                  {monthLabel}
                </h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    disabled={!canGoPrev}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full text-gray-700 transition hover:bg-gray-100",
                      !canGoPrev && "cursor-not-allowed opacity-40 hover:bg-transparent",
                    )}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextMonth}
                    className="grid h-8 w-8 place-items-center rounded-full text-gray-700 transition hover:bg-gray-100"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500">
                {WEEKDAYS.map((d, i) => (
                  <div key={`${d}-${i}`} className="py-0.5">
                    {d}
                  </div>
                ))}
              </div>

              <div className="mt-1 grid grid-cols-7 gap-2">
                {cells.map(({ date, inMonth }, idx) => {
                  const isSelected = pickedDate && sameCalendarDay(date, pickedDate);
                  const isPast = isBeforeDay(date, today);
                  const isToday = sameCalendarDay(date, today);
                  const disabled = isPast;
                  return (
                    <button
                      key={`${date.toISOString()}-${idx}`}
                      type="button"
                      onClick={() => onPickDate(date)}
                      disabled={disabled}
                      aria-disabled={disabled}
                      className={cn(
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition sm:h-9 sm:w-9",
                        !inMonth && !isSelected && "text-gray-300",
                        inMonth && !isSelected && !isPast && "text-gray-900 hover:bg-gray-100",
                        isPast && "cursor-not-allowed text-gray-300 line-through",
                        isToday && !isSelected && "ring-1 ring-primary/40",
                        isSelected && "bg-primary font-semibold text-white hover:bg-primary",
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeslots — right, flows wide / short */}
            <div className="flex min-w-0 flex-col border-t border-gray-100 pt-4 md:w-[220px] md:shrink-0 md:border-l md:border-t-0 md:pl-6 md:pt-0 lg:w-[240px]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">Timeslot</p>
                {availability.status === "loading" ? (
                  <div
                    aria-hidden
                    className="h-3 w-14 rounded-full bg-gray-200 animate-pulse"
                  />
                ) : null}
              </div>

              {!pickedDate ? (
                <p className="mt-2 text-xs text-gray-500">
                  Choose a date first, then a time.
                </p>
              ) : availability.status === "loading" ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-3 w-40 rounded-full bg-gray-200" />
                  <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 rounded-full bg-gray-200/80"
                      />
                    ))}
                  </div>
                </div>
              ) : availability.status === "error" ? (
                <p className="mt-2 text-xs text-red-600">{availability.message}</p>
              ) : isBlocked ? (
                <div className="mt-3 rounded-2xl border border-primary/15 bg-primary/5 px-3 py-3">
                  <p className="text-xs font-semibold text-primary">Holiday / Closed</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {blockedReason ?? "We're closed on this date. Please pick another day."}
                  </p>
                </div>
              ) : !hasAnySlots ? (
                <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                  <p className="text-xs font-semibold text-gray-900">No slots available</p>
                  <p className="mt-1 text-xs text-gray-600">
                    There are no timeslots for this day yet. Please choose another date.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-2 grid grid-cols-4 gap-2 md:grid-cols-2">
                    {slots.map((slot) => {
                      const active = pickedTime === slot.time;
                      const disabled = !slot.available;
                      const title = disabled
                        ? slot.reason === "past"
                          ? "This time has already passed"
                          : "Unavailable"
                        : undefined;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => onPickTime(slot)}
                          disabled={disabled}
                          title={title}
                          className={cn(
                            "rounded-full border px-2 py-1.5 text-center text-[11px] font-semibold transition sm:text-xs",
                            disabled &&
                              "cursor-not-allowed border-gray-200 text-gray-300 line-through",
                            !disabled &&
                              !active &&
                              "border-primary text-primary hover:bg-primary/5",
                            !disabled && active && "border-primary bg-primary/10 text-primary",
                          )}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                  {!hasAvailableSlot ? (
                    <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                      <p className="text-xs font-semibold text-gray-900">No upcoming times</p>
                      <p className="mt-1 text-xs text-gray-600">
                        All slots for this day have passed. Please pick a later date.
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
