"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { AvailabilityForDateDto, DateSlotDto } from "@repo/types";
import { cn } from "../../lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

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
  value: string;
  onChange: (value: string) => void;
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
  const [open, setOpen] = useState(false);

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
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) close();
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

    fetch(`/api/availability?date=${key}`, { signal: controller.signal })
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
  }, [pickedDate]);

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
    onChange(formatSelection(pickedDate, slot.time));
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

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(calc(100vw-2rem),600px)] rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:p-5 md:left-auto md:right-0"
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" aria-hidden />
                ) : null}
              </div>

              {!pickedDate ? (
                <p className="mt-2 text-xs text-gray-500">
                  Choose a date first, then a time.
                </p>
              ) : availability.status === "loading" ? (
                <p className="mt-2 text-xs text-gray-400">Checking available slots…</p>
              ) : availability.status === "error" ? (
                <p className="mt-2 text-xs text-red-600">{availability.message}</p>
              ) : isBlocked ? (
                <p className="mt-2 text-xs text-gray-500">
                  {blockedReason ?? "We're closed on this date. Please pick another day."}
                </p>
              ) : !hasAnySlots ? (
                <p className="mt-2 text-xs text-gray-500">
                  No slots configured for this day. Please pick another day.
                </p>
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
                    <p className="mt-2 text-xs text-gray-500">
                      All slots for this day have passed. Please pick a later day.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
