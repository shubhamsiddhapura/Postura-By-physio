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
import { Button } from "@/components/ui/Button";

type Props = {
  initialSearch: string;
  initialPublished: "true" | "false" | "all";
  initialTag: string;
  tags: string[];
};

const ALL_TAGS_VALUE = "__all__";

function buildUrl(pathname: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v || v === "" || v === "all") continue;
    sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${pathname}?${s}` : pathname;
}

export function TestimonialsFilters({
  initialSearch,
  initialPublished,
  initialTag,
  tags,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [published, setPublished] = useState<Props["initialPublished"]>(
    initialPublished
  );
  const [tag, setTag] = useState(initialTag || ALL_TAGS_VALUE);

  useEffect(() => {
    setSearch(initialSearch);
    setPublished(initialPublished);
    setTag(initialTag || ALL_TAGS_VALUE);
  }, [initialPublished, initialSearch, initialTag]);

  const hasFilters = useMemo(
    () =>
      search.trim() !== "" || published !== "all" || tag !== ALL_TAGS_VALUE,
    [published, search, tag]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = buildUrl(pathname, {
        search: search.trim() || undefined,
        published,
        tag: tag === ALL_TAGS_VALUE ? undefined : tag.trim() || undefined,
      });
      const cur = buildUrl(pathname, {
        search: (searchParams.get("search") ?? "").trim() || undefined,
        published:
          (searchParams.get("published") as Props["initialPublished"]) ?? "all",
        tag: (searchParams.get("tag") ?? "").trim() || undefined,
      });
      if (next !== cur) router.replace(next);
    }, 250);
    return () => window.clearTimeout(t);
  }, [pathname, published, router, search, searchParams, tag]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[240px] max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or quote..."
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
            <SelectItem value="false">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select value={tag} onValueChange={(v) => setTag(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TAGS_VALUE}>All tags</SelectItem>
            {tags.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
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

