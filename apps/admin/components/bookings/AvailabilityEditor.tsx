"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Ban, Clock, Plus, Trash2 } from "lucide-react";
import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  DayOfWeek,
} from "@repo/types";
import { DAYS_OF_WEEK, DAY_OF_WEEK_LABELS } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { availabilityApi } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  initialSlots: AvailabilitySlotDto[];
  initialBlockedDates: BlockedDateDto[];
};

/**
 * Admin editor for the weekly availability template + one-off blocked
 * dates. All mutations are optimistic on the success path but we fall
 * through to the shared error display on failure so admins always see a
 * clear reason.
 */
export function AvailabilityEditor({
  initialSlots,
  initialBlockedDates,
}: Props) {
  const [slots, setSlots] = useState<AvailabilitySlotDto[]>(initialSlots);
  const [blockedDates, setBlockedDates] =
    useState<BlockedDateDto[]>(initialBlockedDates);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const slotsByDay = useMemo(() => {
    const acc: Record<DayOfWeek, AvailabilitySlotDto[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    };
    for (const s of slots) acc[s.dayOfWeek].push(s);
    for (const d of DAYS_OF_WEEK) acc[d].sort((a, b) => a.sortKey - b.sortKey);
    return acc;
  }, [slots]);

  const removeSlot = useCallback((id: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await availabilityApi.removeSlot(id);
        setSlots((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not remove slot");
      }
    });
  }, []);

  const createSlot = useCallback(
    (dayOfWeek: DayOfWeek, minutes: number) => {
      setError(null);
      startTransition(async () => {
        try {
          const existing = slotsByDay[dayOfWeek].find((s) => s.sortKey === minutes);
          if (existing) return;
          const time = formatMinutes(minutes);
          const { data } = await availabilityApi.createSlot({ dayOfWeek, time });
          setSlots((prev) => [...prev, data]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not add slot");
        }
      });
    },
    [slotsByDay]
  );

  const deleteSlot = useCallback(
    (dayOfWeek: DayOfWeek, minutes: number) => {
      setError(null);
      startTransition(async () => {
        try {
          const existing = slotsByDay[dayOfWeek].find((s) => s.sortKey === minutes);
          if (!existing) return;
          await availabilityApi.removeSlot(existing.id);
          setSlots((prev) => prev.filter((s) => s.id !== existing.id));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not remove slot");
        }
      });
    },
    [slotsByDay]
  );

  const addRange = useCallback(
    (dayOfWeek: DayOfWeek, startMinutes: number, endMinutes: number) => {
      setError(null);
      startTransition(async () => {
        try {
          const toCreate: number[] = [];
          for (
            let m = startMinutes;
            m < endMinutes;
            m += GRID_STEP_MINUTES
          ) {
            const exists = slotsByDay[dayOfWeek].some((s) => s.sortKey === m);
            if (!exists) toCreate.push(m);
          }
          for (const m of toCreate) {
            const time = formatMinutes(m);
            const { data } = await availabilityApi.createSlot({ dayOfWeek, time });
            setSlots((prev) => [...prev, data]);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not add slots");
        }
      });
    },
    [slotsByDay]
  );

  const removeRange = useCallback(
    (dayOfWeek: DayOfWeek, startMinutes: number, endMinutes: number) => {
      setError(null);
      startTransition(async () => {
        try {
          const toRemove = slotsByDay[dayOfWeek].filter(
            (s) => s.sortKey >= startMinutes && s.sortKey < endMinutes
          );
          for (const s of toRemove) {
            await availabilityApi.removeSlot(s.id);
            setSlots((prev) => prev.filter((x) => x.id !== s.id));
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Could not remove slots"
          );
        }
      });
    },
    [slotsByDay]
  );

  const addBlockedDate = useCallback(
    (date: string, reason: string | null, onDone: () => void) => {
      setError(null);
      startTransition(async () => {
        try {
          const { data } = await availabilityApi.createBlockedDate({
            date,
            reason,
          });
          setBlockedDates((prev) =>
            [...prev, data].sort((a, b) => a.date.localeCompare(b.date))
          );
          onDone();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not block date");
        }
      });
    },
    []
  );

  const removeBlockedDate = useCallback((id: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await availabilityApi.removeBlockedDate(id);
        setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not unblock date");
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <CardTitle>Weekly schedule</CardTitle>
          </div>
          <CardDescription>
            Drag on the timeline to add a time block. Click an existing block to
            remove it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklySlotTimeline
            slotsByDay={slotsByDay}
            busy={isPending}
            onAddRange={addRange}
            onRemoveRange={removeRange}
            onRemoveSingle={deleteSlot}
            onAddSingle={createSlot}
          />
          <p className="mt-3 text-xs text-gray-500">
            Tip: keep blocks around <span className="font-medium">30–60 mins</span>{" "}
            for easier scheduling.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-gray-500" />
            <CardTitle>Blocked dates</CardTitle>
          </div>
          <CardDescription>
            Close the clinic on a specific date (holidays, leave, events). The
            weekly schedule still applies to every other date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlockedDateForm busy={isPending} onSubmit={addBlockedDate} />

          <div className="mt-4">
            {blockedDates.length === 0 ? (
              <p className="text-sm text-gray-500">
                No blocked dates. The weekly schedule will apply to every day.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {blockedDates.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {formatDate(b.date)}
                      </span>
                      {b.reason ? (
                        <span className="ml-2 text-gray-500">{b.reason}</span>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlockedDate(b.id)}
                      disabled={isPending}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Morning block: 7 AM – 1 PM  |  Evening block: 5 PM – 9 PM
const GRID_START_MINUTES = 7 * 60;   // 7:00 AM
const GRID_END_MINUTES   = 21 * 60;  // 9:00 PM
const GRID_STEP_MINUTES  = 60;       // 1-hour sessions
const ROW_PX = 56;
const SUNDAY: DayOfWeek = 0;

type Range = { start: number; end: number };

function WeeklySlotTimeline({
  slotsByDay,
  busy,
  onAddRange,
  onRemoveRange,
  onAddSingle,
  onRemoveSingle,
}: {
  slotsByDay: Record<DayOfWeek, AvailabilitySlotDto[]>;
  busy: boolean;
  onAddRange: (dayOfWeek: DayOfWeek, start: number, end: number) => void;
  onRemoveRange: (dayOfWeek: DayOfWeek, start: number, end: number) => void;
  onAddSingle: (dayOfWeek: DayOfWeek, minutes: number) => void;
  onRemoveSingle: (dayOfWeek: DayOfWeek, minutes: number) => void;
}) {
  const [day, setDay] = useState<DayOfWeek>(1);
  const [drag, setDrag] = useState<{
    start: number;
    current: number;
  } | null>(null);

  const minutesList = useMemo(() => {
    const out: number[] = [];
    for (let m = GRID_START_MINUTES; m <= GRID_END_MINUTES; m += GRID_STEP_MINUTES) {
      out.push(m);
    }
    return out;
  }, []);

  // Render each slot as its own 1-hour block so admins can remove single hours
  // without wiping the whole contiguous range.
  const blocks = useMemo(() => {
    const sorted = [...slotsByDay[day]].sort((a, b) => a.sortKey - b.sortKey);
    return sorted.map((s) => ({ start: s.sortKey, end: s.sortKey + GRID_STEP_MINUTES }));
  }, [slotsByDay, day]);

  const clampToStep = (minutes: number) => {
    const clamped = Math.min(Math.max(minutes, GRID_START_MINUTES), GRID_END_MINUTES);
    const snapped =
      Math.round((clamped - GRID_START_MINUTES) / GRID_STEP_MINUTES) * GRID_STEP_MINUTES +
      GRID_START_MINUTES;
    return Math.min(Math.max(snapped, GRID_START_MINUTES), GRID_END_MINUTES);
  };

  const minutesFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el) return GRID_START_MINUTES;
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pct = y / rect.height;
    const raw = GRID_START_MINUTES + pct * (GRID_END_MINUTES - GRID_START_MINUTES);
    return clampToStep(raw);
  };

  const preview: Range | null = drag
    ? {
        start: Math.min(drag.start, drag.current),
        end: Math.max(drag.start, drag.current) + GRID_STEP_MINUTES,
      }
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Day picker */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-2">
        {DAYS_OF_WEEK.map((d) => (
          d === SUNDAY ? (
            <span
              key={d}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-400 bg-gray-100 cursor-not-allowed select-none"
              title="Closed on Sundays"
            >
              {DAY_OF_WEEK_LABELS[d]} <span className="text-[10px]">(Closed)</span>
            </span>
          ) : (
            <button
              key={d}
              type="button"
              disabled={busy}
              onClick={() => setDay(d)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                day === d ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              {DAY_OF_WEEK_LABELS[d]}
            </button>
          )
        ))}
        <div className="ml-auto hidden items-center gap-2 text-xs text-gray-500 sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Available
          </span>
          <span>Drag to add · Click block to remove</span>
        </div>
      </div>

      <div className="grid grid-cols-[88px_1fr]">
        {/* Time gutter */}
        <div className="border-r border-gray-200 bg-white">
          {minutesList.map((m) => (
            <div
              key={m}
              className="border-b border-gray-100 px-3 pt-2 text-[11px] font-medium text-gray-500"
              style={{ height: ROW_PX }}
            >
              {formatMinutes(m)}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div
            className={cn(
              "relative select-none",
              busy && "pointer-events-none opacity-60"
            )}
            style={{ height: minutesList.length * ROW_PX }}
            onMouseDown={(e) => {
              const start = minutesFromEvent(e);
              setDrag({ start, current: start });
            }}
            onMouseMove={(e) => {
              if (!drag) return;
              const current = minutesFromEvent(e);
              setDrag((d) => (d ? { ...d, current } : null));
            }}
            onMouseUp={() => {
              if (!preview) return;
              setDrag(null);
              if (preview.end - preview.start <= 0) return;
              onAddRange(day, preview.start, preview.end);
            }}
            onMouseLeave={() => setDrag(null)}
          >
            {/* Row separators */}
            {minutesList.map((m) => (
              <div
                key={m}
                className="border-b border-gray-100"
                style={{ height: ROW_PX }}
              />
            ))}

            {/* Existing blocks */}
            {blocks.map((r, idx) => (
              <button
                key={`${r.start}-${r.end}-${idx}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSingle(day, r.start);
                }}
                className="absolute left-3 right-3 rounded-xl border border-primary/25 bg-primary/15 px-3 py-1.5 text-left shadow-sm transition hover:bg-primary/20 overflow-hidden"
                style={{
                  top:
                    ((r.start - GRID_START_MINUTES) / GRID_STEP_MINUTES) *
                    ROW_PX,
                  height: Math.max(
                    32,
                    ((r.end - r.start) / GRID_STEP_MINUTES) * ROW_PX - 8
                  ),
                }}
                title="Click to remove this block"
              >
                <div className="relative h-full overflow-hidden pr-14">
                  <p className="truncate text-xs font-semibold leading-tight text-primary">
                    {formatMinutes(r.start)} – {formatMinutes(r.end)}
                  </p>
                  <p className="mt-0.5 hidden truncate text-[10px] leading-tight text-gray-600 opacity-80 sm:block">
                    Available
                  </p>

                  <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm">
                    Remove
                  </span>
                </div>
              </button>
            ))}

            {/* Drag preview */}
            {preview ? (
              <div
                className="pointer-events-none absolute left-3 right-3 rounded-xl border border-primary/30 bg-primary/10"
                style={{
                  top:
                    ((preview.start - GRID_START_MINUTES) / GRID_STEP_MINUTES) *
                    ROW_PX,
                  height:
                    ((preview.end - preview.start) / GRID_STEP_MINUTES) * ROW_PX,
                }}
              />
            ) : null}
          </div>

          {/* Quick add/remove single slot */}
          <div className="border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            Quick-toggle individual hour slots:
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Morning: 7 AM – 12 PM */}
              {[7, 8, 9, 10, 11, 12].map((h) => h * 60).map((m) => (
                <button
                  key={m}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    const exists = slotsByDay[day].some((s) => s.sortKey === m);
                    exists ? onRemoveSingle(day, m) : onAddSingle(day, m);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 font-semibold",
                    slotsByDay[day].some((s) => s.sortKey === m)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {formatMinutes(m)}
                </button>
              ))}
              <span className="self-center text-gray-300">|</span>
              {/* Evening: 5 PM – 8 PM */}
              {[17, 18, 19, 20].map((h) => h * 60).map((m) => (
                <button
                  key={m}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    const exists = slotsByDay[day].some((s) => s.sortKey === m);
                    exists ? onRemoveSingle(day, m) : onAddSingle(day, m);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 font-semibold",
                    slotsByDay[day].some((s) => s.sortKey === m)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {formatMinutes(m)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-gray-400">
              Clinic hours: <span className="font-medium text-gray-500">7 AM – 1 PM</span> &amp; <span className="font-medium text-gray-500">5 PM – 9 PM</span> · Closed on Sundays
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockedDateForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (date: string, reason: string | null, done: () => void) => void;
}) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!date) return;
        onSubmit(date, reason.trim() === "" ? null : reason.trim(), () => {
          setDate("");
          setReason("");
        });
      }}
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={today}
        className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
      />
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional) — e.g. public holiday"
        className="h-9 min-w-[220px] flex-1 rounded-md border border-gray-300 bg-white px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
      />
      <Button type="submit" disabled={busy || date === ""} size="sm">
        <Plus className="h-3.5 w-3.5" />
        Block date
      </Button>
    </form>
  );
}

/** "2026-04-22" -> "Wed, Apr 22, 2026" */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMinutes(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = (h24 % 12) || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
