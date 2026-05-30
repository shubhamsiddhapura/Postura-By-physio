"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Props = {
  initialSearch: string;
  initialPublished: "true" | "false" | "all";
};

function buildUrl(
  pathname: string,
  params: Record<string, string | undefined>
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v || v === "" || v === "all") continue;
    sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${pathname}?${s}` : pathname;
}

export function BlogsFilters({ initialSearch, initialPublished }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [published, setPublished] = useState<Props["initialPublished"]>(
    initialPublished
  );

  // Keep local state in sync with URL (back/forward navigation).
  useEffect(() => {
    setSearch(initialSearch);
    setPublished(initialPublished);
  }, [initialSearch, initialPublished]);

  const hasFilters = useMemo(
    () => search.trim() !== "" || published !== "all",
    [search, published]
  );

  // Debounced search apply.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = buildUrl(pathname, {
        search: search.trim() || undefined,
        published,
        page: undefined, // reset paging when filters change
      });

      // Avoid unnecessary replace loops.
      const cur = buildUrl(pathname, {
        search: (searchParams.get("search") ?? "").trim() || undefined,
        published: (searchParams.get("published") as Props["initialPublished"]) ?? "all",
        page: undefined,
      });
      if (next !== cur) router.replace(next);
    }, 250);
    return () => window.clearTimeout(t);
  }, [pathname, published, router, search, searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[240px] max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or excerpt..."
          className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
        />
      </div>

      <div className="w-40">
        <Select
          value={published}
          onValueChange={(v) => setPublished(v as Props["initialPublished"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="true">Published</SelectItem>
            <SelectItem value="false">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setPublished("all");
            router.replace(pathname);
          }}
          className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

