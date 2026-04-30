"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { BookingStatus } from "@repo/types";
import {
  BOOKING_PROGRAMS,
  BOOKING_PROGRAM_LABELS,
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@repo/types";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Props = {
  initialSearch: string;
  initialStatus: BookingStatus | "all";
  initialProgram: string | "all";
};

function buildUrl(pathname: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v || v === "" || v === "all") continue;
    sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${pathname}?${s}` : pathname;
}

export function BookingsFilters({
  initialSearch,
  initialStatus,
  initialProgram,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<Props["initialStatus"]>(initialStatus);
  const [program, setProgram] = useState<Props["initialProgram"]>(initialProgram);

  useEffect(() => {
    setSearch(initialSearch);
    setStatus(initialStatus);
    setProgram(initialProgram);
  }, [initialProgram, initialSearch, initialStatus]);

  const hasFilters =
    search.trim() !== "" || status !== "all" || program !== "all";

  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = buildUrl(pathname, {
        search: search.trim() || undefined,
        status,
        program,
      });

      const cur = buildUrl(pathname, {
        search: (searchParams.get("search") ?? "").trim() || undefined,
        status: (searchParams.get("status") as Props["initialStatus"]) ?? "all",
        program: (searchParams.get("program") as Props["initialProgram"]) ?? "all",
      });

      if (next !== cur) router.replace(next);
    }, 250);
    return () => window.clearTimeout(t);
  }, [pathname, program, router, search, searchParams, status]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name / phone / email..."
          className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
        />
      </div>

      <div className="w-44">
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {BOOKING_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {BOOKING_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select value={program} onValueChange={(v) => setProgram(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            {BOOKING_PROGRAMS.map((p) => (
              <SelectItem key={p} value={p}>
                {BOOKING_PROGRAM_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.replace(pathname)}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}

