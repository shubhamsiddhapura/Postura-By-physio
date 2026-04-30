import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import type { TestimonialDto } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteTestimonialButton } from "@/components/testimonials/DeleteTestimonialButton";
import { TestimonialPreviewCard } from "@/components/testimonials/TestimonialPreviewCard";
import { testimonialsApi } from "@/lib/api";
import { TestimonialsFilters } from "./TestimonialsFilters";

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
  let allTags: string[] = [];

  const publishedArg =
    publishedFilter === "true"
      ? true
      : publishedFilter === "false"
        ? false
        : undefined;

  const needsTagSource =
    Boolean(search?.trim()) ||
    Boolean(tagFilter) ||
    typeof publishedArg === "boolean";

  try {
    if (needsTagSource) {
      const [filteredRes, allRes] = await Promise.all([
        testimonialsApi.list({
          limit: 60,
          search,
          tag: tagFilter,
          published: publishedArg,
        }),
        testimonialsApi.list({ limit: 200 }),
      ]);
      items = filteredRes.data;
      total = filteredRes.meta?.total ?? items.length;
      allTags = Array.from(new Set(allRes.data.map((t) => t.tag))).sort();
    } else {
      const res = await testimonialsApi.list({ limit: 60 });
      items = res.data;
      total = res.meta?.total ?? items.length;
      allTags = Array.from(new Set(res.data.map((t) => t.tag))).sort();
    }
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load testimonials";
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

      <div className="mx-auto w-full space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <TestimonialsFilters
          initialSearch={search ?? ""}
          initialPublished={publishedFilter}
          initialTag={tagFilter ?? ""}
          tags={allTags}
        />

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <TestimonialCardTile key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500">
          {items.length} of {total} shown
        </p>
      </div>
    </>
  );
}

/**
 * A single grid tile in the admin list. Wraps the exact public
 * card visual and layers admin-only controls on top so the admin can
 * see live how each card renders on the public page while still
 * reaching edit / delete / publish status in one click.
 */
function TestimonialCardTile({ testimonial }: { testimonial: TestimonialDto }) {
  return (
    <div
      className="group flex flex-col"
      style={{
        contentVisibility: "auto",
        contain: "layout paint",
        containIntrinsicSize: "360px 420px",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5">
          {testimonial.published ? (
            <Badge tone="green">Published</Badge>
          ) : (
            <Badge tone="amber">Hidden</Badge>
          )}
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200">
            #{testimonial.order}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/testimonials/${testimonial.id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <DeleteTestimonialButton id={testimonial.id} label={testimonial.name} />
        </div>
      </div>

      <TestimonialPreviewCard
        data={{
          tag: testimonial.tag,
          quote: testimonial.quote,
          name: testimonial.name,
          age: testimonial.age,
          avatar: testimonial.avatar,
          rating: testimonial.rating,
        }}
        className={testimonial.published ? undefined : "opacity-80 ring-1 ring-amber-200"}
      />
    </div>
  );
}
