"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

const TIME_SLOTS = ["7:00 AM", "8:30 AM", "10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "5:30 PM"];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
  const [viewDate, setViewDate] = useState(() => new Date());
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

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

  const goPrevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const onPickDate = (date: Date) => {
    setPickedDate(date);
    setPickedTime(null);
  };

  const onPickTime = (slot: string) => {
    if (!pickedDate) return;
    setPickedTime(slot);
    onChange(formatSelection(pickedDate, slot));
    close();
  };

  const displayValue = value;

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
                    className="grid h-8 w-8 place-items-center rounded-full text-gray-700 transition hover:bg-gray-100"
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
                  return (
                    <button
                      key={`${date.toISOString()}-${idx}`}
                      type="button"
                      onClick={() => onPickDate(date)}
                      className={cn(
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition sm:h-9 sm:w-9",
                        !inMonth && "text-gray-300",
                        inMonth && !isSelected && "text-gray-900 hover:bg-gray-100",
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
              <p className="text-sm font-bold text-gray-900">Timeslot</p>
              <div className="mt-2 grid grid-cols-4 gap-2 md:grid-cols-2">
                {TIME_SLOTS.map((slot) => {
                  const active = pickedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onPickTime(slot)}
                      disabled={!pickedDate}
                      className={cn(
                        "rounded-full border px-2 py-1.5 text-center text-[11px] font-semibold transition sm:text-xs",
                        !pickedDate && "cursor-not-allowed opacity-40",
                        pickedDate &&
                          !active &&
                          "border-primary text-primary hover:bg-primary/5",
                        pickedDate && active && "border-primary bg-primary/10 text-primary",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {!pickedDate ? (
                <p className="mt-2 text-xs text-gray-500">Choose a date first, then a time.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
