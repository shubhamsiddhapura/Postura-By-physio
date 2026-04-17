"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Plus, Trash2, Ban, Clock } from "lucide-react";
import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  DayOfWeek,
} from "@repo/types";
import { DAYS_OF_WEEK, DAY_OF_WEEK_LABELS } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { availabilityApi } from "@/lib/api";

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

  const addSlot = useCallback(
    (dayOfWeek: DayOfWeek, time: string, onDone: () => void) => {
      setError(null);
      startTransition(async () => {
        try {
          const { data } = await availabilityApi.createSlot({ dayOfWeek, time });
          setSlots((prev) => [...prev, data]);
          onDone();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not add slot");
        }
      });
    },
    []
  );

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
            Times customers can pick on the booking form. Days without any
            slot are treated as closed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS_OF_WEEK.map((d) => (
              <DayColumn
                key={d}
                dayOfWeek={d}
                slots={slotsByDay[d]}
                busy={isPending}
                onAdd={(time, onDone) => addSlot(d, time, onDone)}
                onRemove={removeSlot}
              />
            ))}
          </div>
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

function DayColumn({
  dayOfWeek,
  slots,
  busy,
  onAdd,
  onRemove,
}: {
  dayOfWeek: DayOfWeek;
  slots: AvailabilitySlotDto[];
  busy: boolean;
  onAdd: (time: string, done: () => void) => void;
  onRemove: (id: string) => void;
}) {
  const [time, setTime] = useState("");

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-gray-200 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {DAY_OF_WEEK_LABELS[dayOfWeek]}
      </p>

      {slots.length === 0 ? (
        <p className="text-xs text-gray-400">Closed</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {slots.map((s) => (
            <li
              key={s.id}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 pl-2.5 pr-1 text-xs font-medium text-gray-700"
            >
              {s.time}
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                disabled={busy}
                aria-label={`Remove ${s.time}`}
                className="grid h-5 w-5 place-items-center rounded-full text-gray-400 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Stacked so narrow 7-column layouts never overflow. `min-w-0` on the
          input lets flex actually shrink it below placeholder width. */}
      <div className="mt-3 flex flex-col gap-1.5">
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="10:00 AM"
          className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy || time.trim() === ""}
          onClick={() => onAdd(time.trim(), () => setTime(""))}
          className="h-7 w-full"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
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
