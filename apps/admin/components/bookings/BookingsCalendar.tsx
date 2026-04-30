"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  BookingDto,
  BookingStatus,
  DayOfWeek,
} from "@repo/types";
import { BOOKING_STATUS_LABELS } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type View = "month" | "week" | "day" | "list";

type Props = {
  bookings: BookingDto[];
  slots: AvailabilitySlotDto[];
  blockedDates: BlockedDateDto[];
};

/**
 * Full-screen month/week/day/list calendar for bookings.
 *
 * Dates are derived from `preferredDateTimeUtc` when present (canonical)
 * and fall back to the legacy `preferredDateTime` display string for
 * rows that predate timezone support. Grouping/positioning happens in
 * the admin's *browser* timezone, matching the rest of the admin UI.
 */
export function BookingsCalendar({ bookings, slots, blockedDates }: Props) {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState<Date>(() => startOfDay(new Date()));
  const [hover, setHover] = useState<{
    event: CalendarEvent;
    rect: DOMRect;
  } | null>(null);

  const events = useMemo(() => buildEvents(bookings), [bookings]);
  const eventsByDay = useMemo(() => groupByLocalDate(events), [events]);
  const slotsByDow = useMemo(() => groupSlotsByDow(slots), [slots]);
  const blockedSet = useMemo(
    () => new Set(blockedDates.map((b) => b.date)),
    [blockedDates]
  );

  const headerLabel = formatHeader(cursor, view);

  const gotoPrev = () => setCursor((c) => shift(c, view, -1));
  const gotoNext = () => setCursor((c) => shift(c, view, 1));
  const gotoToday = () => setCursor(startOfDay(new Date()));

  const onHoverEvent = (event: CalendarEvent, rect: DOMRect) =>
    setHover({ event, rect });
  const onLeaveEvent = () => setHover(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white">
              <button
                type="button"
                onClick={gotoPrev}
                aria-label="Previous"
                className="grid h-8 w-8 place-items-center text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={gotoNext}
                aria-label="Next"
                className="grid h-8 w-8 place-items-center border-l border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Button variant="primary" size="sm" onClick={gotoToday}>
              today
            </Button>
          </div>

          <h2 className="order-last w-full text-center text-lg font-semibold text-gray-900 sm:order-none sm:w-auto">
            {headerLabel}
          </h2>

          <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white text-xs">
            {(["month", "week", "day", "list"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 font-medium capitalize transition-colors",
                  view === v
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* View surface */}
        {view === "month" && (
          <MonthView
            cursor={cursor}
            eventsByDay={eventsByDay}
            slotsByDow={slotsByDow}
            blockedSet={blockedSet}
            onPickDay={(d) => {
              setCursor(d);
              setView("day");
            }}
            onHoverEvent={onHoverEvent}
            onLeaveEvent={onLeaveEvent}
          />
        )}
        {view === "week" && (
          <WeekView
            cursor={cursor}
            eventsByDay={eventsByDay}
            onHoverEvent={onHoverEvent}
            onLeaveEvent={onLeaveEvent}
          />
        )}
        {view === "day" && (
          <DayView
            cursor={cursor}
            eventsByDay={eventsByDay}
            onHoverEvent={onHoverEvent}
            onLeaveEvent={onLeaveEvent}
          />
        )}
        {view === "list" && (
          <ListView
            cursor={cursor}
            events={events}
            onHoverEvent={onHoverEvent}
            onLeaveEvent={onLeaveEvent}
          />
        )}
      </div>

      <HoverPopover hover={hover} />
    </div>
  );
}

// ---------------- Month view ----------------

function MonthView({
  cursor,
  eventsByDay,
  slotsByDow,
  blockedSet,
  onPickDay,
  onHoverEvent,
  onLeaveEvent,
}: {
  cursor: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  slotsByDow: Record<DayOfWeek, number>;
  blockedSet: Set<string>;
  onPickDay: (d: Date) => void;
  onHoverEvent: (event: CalendarEvent, rect: DOMRect) => void;
  onLeaveEvent: () => void;
}) {
  const gridStart = startOfWeek(startOfMonth(cursor));
  const gridEnd = endOfWeek(endOfMonth(cursor));
  const weeks: Date[][] = [];
  let day = gridStart;
  while (day <= gridEnd) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(day);
      day = addDays(day, 1);
    }
    weeks.push(row);
  }

  const todayKey = dateKey(new Date());
  const month = cursor.getMonth();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {/* Weekday header */}
      <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] border-b border-gray-200 bg-gray-50 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
        <div />
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {weeks.map((row, wi) => (
        <div
          key={wi}
          className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] border-b border-gray-200 last:border-b-0"
        >
          <div className="grid place-items-center border-r border-gray-200 bg-gray-50 text-xs font-medium text-gray-400">
            W{getISOWeek(row[0])}
          </div>
          {row.map((d) => {
            const key = dateKey(d);
            const dayEvents = eventsByDay.get(key) ?? [];
            const isOtherMonth = d.getMonth() !== month;
            const isToday = key === todayKey;
            const isBlocked = blockedSet.has(key);
            const dow = d.getDay() as DayOfWeek;
            const dayTotalSlots = isBlocked ? 0 : slotsByDow[dow] ?? 0;
            const freeSlots = Math.max(0, dayTotalSlots - dayEvents.length);

            return (
              <button
                key={key}
                type="button"
                onClick={() => onPickDay(d)}
                className={cn(
                  "group flex min-h-[110px] flex-col items-stretch border-r border-gray-200 p-1.5 text-left last:border-r-0 hover:bg-gray-50/60",
                  isOtherMonth && "bg-gray-50/40 text-gray-400",
                  isToday && "bg-amber-50/60",
                  isBlocked && "bg-red-50/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-medium",
                      isToday
                        ? "bg-primary text-white"
                        : isOtherMonth
                        ? "text-gray-400"
                        : "text-gray-700"
                    )}
                  >
                    {d.getDate()}
                  </span>
                  {!isOtherMonth && dayTotalSlots > 0 ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] font-medium",
                        freeSlots === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      )}
                      title={`${freeSlots} of ${dayTotalSlots} slots open`}
                    >
                      {freeSlots}/{dayTotalSlots}
                    </span>
                  ) : isBlocked && !isOtherMonth ? (
                    <span className="rounded-full bg-red-100 px-1.5 text-[10px] font-medium text-red-700">
                      blocked
                    </span>
                  ) : null}
                </div>

                <div className="mt-1 flex flex-col gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <EventChip
                      key={e.id}
                      event={e}
                      compact
                      onHover={onHoverEvent}
                      onLeave={onLeaveEvent}
                    />
                  ))}
                  {dayEvents.length > 3 ? (
                    <span className="mt-0.5 text-[10px] font-medium text-gray-500">
                      +{dayEvents.length - 3} more
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------- Week / Day views ----------------

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 22;
const HOUR_HEIGHT = 44; // px

function HoursGutter() {
  const hours: number[] = [];
  for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) hours.push(h);
  return (
    <div className="flex flex-col border-r border-gray-200 bg-gray-50 text-[11px] text-gray-500">
      {hours.map((h) => (
        <div
          key={h}
          style={{ height: HOUR_HEIGHT }}
          className="relative px-2 pt-1"
        >
          <span className="absolute -top-1.5 right-2 bg-gray-50 px-1">
            {formatHour(h)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimeGridColumn({
  date,
  events,
  onHoverEvent,
  onLeaveEvent,
}: {
  date: Date;
  events: CalendarEvent[];
  onHoverEvent: (event: CalendarEvent, rect: DOMRect) => void;
  onLeaveEvent: () => void;
}) {
  const totalHours = DAY_END_HOUR - DAY_START_HOUR + 1;
  const dayEvents = events.filter((e) => sameLocalDate(e.at, date));

  return (
    <div
      className="relative border-r border-gray-200 last:border-r-0"
      style={{ height: totalHours * HOUR_HEIGHT }}
    >
      {Array.from({ length: totalHours }).map((_, i) => (
        <div
          key={i}
          style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
          className="absolute inset-x-0 border-b border-gray-100"
        />
      ))}

      {dayEvents.map((e) => {
        const mins = e.at.getHours() * 60 + e.at.getMinutes();
        // Clamp events that land outside the visible window to the edges
        // so the admin still sees them in the column.
        const rawTop = ((mins - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT;
        const top = Math.max(
          0,
          Math.min(rawTop, totalHours * HOUR_HEIGHT - 28)
        );
        return (
          <div
            key={e.id}
            style={{ top, minHeight: 28 }}
            className="absolute inset-x-1"
          >
            <EventChip
              event={e}
              showTime
              onHover={onHoverEvent}
              onLeave={onLeaveEvent}
            />
          </div>
        );
      })}
    </div>
  );
}

function WeekView({
  cursor,
  eventsByDay,
  onHoverEvent,
  onLeaveEvent,
}: {
  cursor: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onHoverEvent: (event: CalendarEvent, rect: DOMRect) => void;
  onLeaveEvent: () => void;
}) {
  const weekStart = startOfWeek(cursor);
  const days: Date[] = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );
  const flatEvents: CalendarEvent[] = [];
  for (const d of days) {
    const k = dateKey(d);
    flatEvents.push(...(eventsByDay.get(k) ?? []));
  }
  const todayKey = dateKey(new Date());

  return (
    <div className="overflow-auto rounded-lg border border-gray-200">
      {/* Header */}
      <div className="grid grid-cols-[64px_repeat(7,minmax(120px,1fr))] border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500">
        <div />
        {days.map((d) => {
          const isToday = dateKey(d) === todayKey;
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "py-2",
                isToday && "bg-amber-50 text-primary"
              )}
            >
              <div className="uppercase tracking-wide">
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div className="text-base font-semibold text-gray-900">
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[64px_repeat(7,minmax(120px,1fr))]">
        <HoursGutter />
        {days.map((d) => (
          <TimeGridColumn
            key={d.toISOString()}
            date={d}
            events={flatEvents}
            onHoverEvent={onHoverEvent}
            onLeaveEvent={onLeaveEvent}
          />
        ))}
      </div>
    </div>
  );
}

function DayView({
  cursor,
  eventsByDay,
  onHoverEvent,
  onLeaveEvent,
}: {
  cursor: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onHoverEvent: (event: CalendarEvent, rect: DOMRect) => void;
  onLeaveEvent: () => void;
}) {
  const events = eventsByDay.get(dateKey(cursor)) ?? [];
  const isToday = dateKey(cursor) === dateKey(new Date());

  return (
    <div className="overflow-auto rounded-lg border border-gray-200">
      <div className="grid grid-cols-[64px_minmax(0,1fr)] border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500">
        <div />
        <div
          className={cn(
            "py-2",
            isToday && "bg-amber-50 text-primary"
          )}
        >
          <div className="uppercase tracking-wide">
            {cursor.toLocaleDateString(undefined, { weekday: "long" })}
          </div>
          <div className="text-base font-semibold text-gray-900">
            {cursor.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[64px_minmax(0,1fr)]">
        <HoursGutter />
        <TimeGridColumn
          date={cursor}
          events={events}
          onHoverEvent={onHoverEvent}
          onLeaveEvent={onLeaveEvent}
        />
      </div>
    </div>
  );
}

// ---------------- List view ----------------

function ListView({
  cursor,
  events,
  onHoverEvent,
  onLeaveEvent,
}: {
  cursor: Date;
  events: CalendarEvent[];
  onHoverEvent: (event: CalendarEvent, rect: DOMRect) => void;
  onLeaveEvent: () => void;
}) {
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const visible = events
    .filter((e) => e.at >= monthStart && e.at <= endOfDay(monthEnd))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-gray-700">
          No bookings this month
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Navigate to a different month using the arrows above.
        </p>
      </div>
    );
  }

  // Group by date key
  const groups = new Map<string, CalendarEvent[]>();
  for (const e of visible) {
    const k = dateKey(e.at);
    const arr = groups.get(k) ?? [];
    arr.push(e);
    groups.set(k, arr);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-100">
        {Array.from(groups.entries()).map(([k, list]) => {
          const date = new Date(`${k}T00:00:00`);
          return (
            <li key={k} className="p-3 sm:p-4">
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {date.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-gray-500">
                  {list.length} booking{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {list.map((e) => (
                  <li key={e.id}>
                    <EventChip
                      event={e}
                      showTime
                      detailed
                      onHover={onHoverEvent}
                      onLeave={onLeaveEvent}
                    />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------- Event chip ----------------

const STATUS_STYLES: Record<
  BookingStatus,
  { border: string; bg: string; text: string }
> = {
  pending: {
    border: "border-amber-500",
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-amber-800",
  },
  confirmed: {
    border: "border-blue-500",
    bg: "bg-blue-50 hover:bg-blue-100",
    text: "text-blue-800",
  },
  completed: {
    border: "border-emerald-500",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-800",
  },
  cancelled: {
    border: "border-red-500",
    bg: "bg-red-50 hover:bg-red-100",
    text: "text-red-800",
  },
};

function EventChip({
  event,
  compact = false,
  showTime = false,
  detailed = false,
  onHover,
  onLeave,
}: {
  event: CalendarEvent;
  compact?: boolean;
  showTime?: boolean;
  detailed?: boolean;
  onHover?: (event: CalendarEvent, rect: DOMRect) => void;
  onLeave?: () => void;
}) {
  const styles = STATUS_STYLES[event.status];
  const timeStr = event.at.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/bookings/${event.id}`}
      title={`${BOOKING_STATUS_LABELS[event.status]} · ${event.title} · ${timeStr}`}
      className={cn(
        "flex items-center gap-1.5 overflow-hidden rounded border-l-[3px] px-1.5 py-0.5 text-[11px] font-medium transition-colors",
        styles.border,
        styles.bg,
        styles.text,
        compact ? "truncate" : "items-start"
      )}
      onMouseEnter={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onHover?.(event, rect);
      }}
      onMouseLeave={() => onLeave?.()}
    >
      {showTime || compact ? (
        <span className="shrink-0 tabular-nums">
          {compact ? formatCompactTime(event.at) : timeStr}
        </span>
      ) : null}
      <span className="truncate">{event.title}</span>
      {detailed ? (
        <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wide text-gray-500">
          {BOOKING_STATUS_LABELS[event.status]}
        </span>
      ) : null}
    </Link>
  );
}

// ---------------- Data helpers ----------------

type CalendarEvent = {
  id: string;
  title: string;
  status: BookingStatus;
  at: Date;
  phone?: string;
  program?: string;
  consultationType?: string | null;
};

function buildEvents(bookings: BookingDto[]): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (const b of bookings) {
    // Calendar should only show actionable / upcoming items.
    if (b.status !== "pending" && b.status !== "confirmed") continue;
    const raw = b.preferredDateTimeUtc ?? b.preferredDateTime;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    out.push({
      id: b.id,
      title: b.fullName,
      status: b.status,
      at: d,
      phone: b.phone,
      program: (b as any).program,
      consultationType: (b as any).consultationType ?? null,
    });
  }
  return out;
}

function HoverPopover({
  hover,
}: {
  hover: { event: CalendarEvent; rect: DOMRect } | null;
}) {
  if (!hover) return null;

  const { event, rect } = hover;
  const timeStr = event.at.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const dateStr = event.at.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const PAD = 12;
  const WIDTH = 292;
  const left = Math.min(
    Math.max(PAD, rect.left + rect.width / 2 - WIDTH / 2),
    window.innerWidth - WIDTH - PAD
  );
  const top = Math.max(PAD, rect.top - 10);

  return (
    <div
      className="pointer-events-none fixed z-[60]"
      style={{ left, top, width: WIDTH, transform: "translateY(-100%)" }}
    >
      <div className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {event.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {dateStr} · {timeStr}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              event.status === "pending"
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800"
            )}
          >
            {BOOKING_STATUS_LABELS[event.status]}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {event.program ? (
            <div className="rounded-xl bg-gray-50 px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Program
              </p>
              <p className="mt-0.5 truncate font-medium text-gray-900">
                {event.program}
              </p>
            </div>
          ) : null}
          {event.phone ? (
            <div className="rounded-xl bg-gray-50 px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Phone
              </p>
              <p className="mt-0.5 truncate font-medium text-gray-900">
                {event.phone}
              </p>
            </div>
          ) : null}
          {event.consultationType ? (
            <div className="col-span-2 rounded-xl bg-gray-50 px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Consultation
              </p>
              <p className="mt-0.5 truncate font-medium text-gray-900">
                {event.consultationType}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function groupByLocalDate(
  events: CalendarEvent[]
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const k = dateKey(e.at);
    const arr = map.get(k) ?? [];
    arr.push(e);
    map.set(k, arr);
  }
  // Sort each day's events chronologically
  for (const list of map.values()) {
    list.sort((a, b) => a.at.getTime() - b.at.getTime());
  }
  return map;
}

function groupSlotsByDow(
  slots: AvailabilitySlotDto[]
): Record<DayOfWeek, number> {
  const out: Record<DayOfWeek, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  for (const s of slots) out[s.dayOfWeek] += 1;
  return out;
}

// ---------------- Date helpers ----------------

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function endOfWeek(d: Date): Date {
  const s = startOfWeek(d);
  return endOfDay(addDays(s, 6));
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function sameLocalDate(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}
function shift(d: Date, view: View, dir: 1 | -1): Date {
  if (view === "month")
    return new Date(d.getFullYear(), d.getMonth() + dir, 1);
  if (view === "week") return addDays(d, 7 * dir);
  if (view === "day") return addDays(d, dir);
  return new Date(d.getFullYear(), d.getMonth() + dir, 1);
}
function formatHeader(d: Date, view: View): string {
  if (view === "day") {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  if (view === "week") {
    const s = startOfWeek(d);
    const e = addDays(s, 6);
    const sameMonth = s.getMonth() === e.getMonth();
    const sameYear = s.getFullYear() === e.getFullYear();
    const startFmt = s.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    // Avoid `toLocaleDateString` when dropping the month — some locales
    // render "Apr 19 – 2026 (day: 25)" style labels. Compose manually
    // so the output is always "Apr 19 – 25, 2026" / "Apr 28 – May 4, 2026".
    const endFmt = sameMonth
      ? `${e.getDate()}, ${e.getFullYear()}`
      : sameYear
      ? e.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : e.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
    return `${startFmt} – ${endFmt}`;
  }
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
function formatHour(h: number): string {
  const hour12 = ((h + 11) % 12) + 1;
  const suffix = h < 12 || h === 24 ? "am" : "pm";
  return `${hour12}${suffix}`;
}
function formatCompactTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const hour12 = ((h + 11) % 12) + 1;
  const suffix = h < 12 ? "a" : "p";
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, "0")}${suffix}`;
}
function getISOWeek(d: Date): number {
  const date = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  );
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}
