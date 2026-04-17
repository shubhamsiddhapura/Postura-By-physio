import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import type { TestimonialDto } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteTestimonialButton } from "@/components/testimonials/DeleteTestimonialButton";
import { testimonialsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  published?: "true" | "false" | "all";
  tag?: string;
};

export default async function TestimonialsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParams.search?.trim() || undefined;
  const publishedFilter = searchParams.published ?? "all";
  const tagFilter = searchParams.tag?.trim() || undefined;

  let items: TestimonialDto[] = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    const res = await testimonialsApi.list({
      limit: 200,
      search,
      tag: tagFilter,
      published:
        publishedFilter === "true"
          ? true
          : publishedFilter === "false"
            ? false
            : undefined,
    });
    items = res.data;
    total = res.meta?.total ?? items.length;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load testimonials";
  }

  // Collect distinct tags for the filter dropdown. Use the full result set
  // server-side so the dropdown shows every tag the admin has created so far.
  let allTags: string[] = [];
  try {
    const all = await testimonialsApi.list({ limit: 200 });
    allTags = Array.from(new Set(all.data.map((t) => t.tag))).sort();
  } catch {
    // swallow — the filter dropdown is a nice-to-have
  }

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Manage patient reviews shown on the public testimonials page."
        actions={
          <Link href="/testimonials/new">
            <Button>
              <Plus className="h-4 w-4" />
              New testimonial
            </Button>
          </Link>
        }
      />

      <div className="space-y-4 px-8 py-6">
        <form
          className="flex flex-wrap items-center gap-3"
          action="/testimonials"
        >
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by name or quote..."
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
            />
          </div>

          <select
            name="published"
            defaultValue={publishedFilter}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            <option value="all">All statuses</option>
            <option value="true">Published</option>
            <option value="false">Hidden</option>
          </select>

          <select
            name="tag"
            defaultValue={tagFilter ?? ""}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <Button variant="outline" type="submit" size="sm">
            Apply
          </Button>

          {search || publishedFilter !== "all" || tagFilter ? (
            <Link
              href="/testimonials"
              className="text-sm text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              Clear
            </Link>
          ) : null}
        </form>

        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load testimonials</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-2 text-xs text-red-600">
              Is the web app running on{" "}
              <code className="rounded bg-red-100 px-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL ??
                  "http://localhost:3000"}
              </code>
              ?
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No testimonials found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {search || publishedFilter !== "all" || tagFilter
                ? "Try clearing your filters."
                : "Add the first patient review to populate the public page."}
            </p>
            <Link href="/testimonials/new" className="mt-4 inline-block">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                New testimonial
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="w-20 px-5 py-3 text-left">Avatar</th>
                  <th className="px-5 py-3 text-left">Person</th>
                  <th className="px-5 py-3 text-left">Tag</th>
                  <th className="px-5 py-3 text-left">Quote</th>
                  <th className="w-20 px-5 py-3 text-left">Order</th>
                  <th className="w-28 px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <Avatar src={t.avatar} alt={t.name} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {t.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Age {t.age}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-700">
                      <span className="inline-flex rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {t.tag}
                      </span>
                    </td>
                    <td className="max-w-md px-5 py-3 text-gray-700">
                      <p className="line-clamp-2">{t.quote}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">#{t.order}</td>
                    <td className="px-5 py-3">
                      {t.published ? (
                        <Badge tone="green">Published</Badge>
                      ) : (
                        <Badge tone="amber">Hidden</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/testimonials/${t.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </Link>
                        <DeleteTestimonialButton id={t.id} label={t.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-500">
          {items.length} of {total} shown
        </p>
      </div>
    </>
  );
}

function Avatar({ src, alt }: { src: string; alt: string }) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const fullSrc = src.startsWith("http") ? src : `${base}${src}`;
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fullSrc} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
