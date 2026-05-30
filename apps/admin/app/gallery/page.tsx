import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import type { GalleryCategory, GalleryImageDto } from "@repo/types";
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { DeleteGalleryButton } from "@/components/gallery/DeleteGalleryButton";
import { galleryApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = {
  category?: string;
};

function isValidCategory(v: string | undefined): v is GalleryCategory {
  return (
    typeof v === "string" &&
    (GALLERY_CATEGORIES as readonly string[]).includes(v)
  );
}

export default async function GalleryListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const categoryFilter: GalleryCategory | "all" = isValidCategory(
    searchParams.category
  )
    ? searchParams.category
    : "all";

  let images: GalleryImageDto[] = [];
  let loadError: string | null = null;

  try {
    const res = await galleryApi.list({
      limit: 200,
      category: categoryFilter === "all" ? undefined : categoryFilter,
    });
    images = res.data;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load gallery";
  }

  // Group for the grid rendering so categories stay separated visually.
  const grouped = new Map<GalleryCategory, GalleryImageDto[]>();
  for (const cat of GALLERY_CATEGORIES) grouped.set(cat, []);
  for (const img of images) grouped.get(img.category)?.push(img);

  const visibleCategories =
    categoryFilter === "all"
      ? (GALLERY_CATEGORIES as readonly GalleryCategory[])
      : [categoryFilter];

  const newHref =
    categoryFilter === "all"
      ? "/gallery/new"
      : `/gallery/new?category=${categoryFilter}`;

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Manage images that appear on the public gallery page."
        actions={
          <Link href={newHref}>
            <Button>
              <Plus className="h-4 w-4" />
              Add image
            </Button>
          </Link>
        }
      />

      <div className="space-y-6 px-8 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill
            href="/gallery"
            label={`All (${images.length})`}
            active={categoryFilter === "all"}
          />
          {GALLERY_CATEGORIES.map((cat) => {
            const count = grouped.get(cat)?.length ?? 0;
            return (
              <CategoryPill
                key={cat}
                href={`/gallery?category=${cat}`}
                label={`${GALLERY_CATEGORY_LABELS[cat]} (${count})`}
                active={categoryFilter === cat}
              />
            );
          })}
        </div>

        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load gallery</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-2 text-xs text-red-600">
              Is the web app running on{" "}
              <code className="rounded bg-red-100 px-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}
              </code>
              ?
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No images yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add images to fill the{" "}
              {categoryFilter === "all"
                ? "gallery"
                : GALLERY_CATEGORY_LABELS[categoryFilter]}{" "}
              section on the public site.
            </p>
            <Link href={newHref} className="mt-4 inline-block">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                Add image
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {visibleCategories.map((cat) => {
              const imgs = grouped.get(cat) ?? [];
              if (imgs.length === 0 && categoryFilter === "all") return null;

              return (
                <section key={cat} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        {GALLERY_CATEGORY_LABELS[cat]}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {imgs.length} image{imgs.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Link href={`/gallery/new?category=${cat}`}>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    </Link>
                  </div>

                  {imgs.length === 0 ? (
                    <p className="rounded-md bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
                      No images in this category yet.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {imgs.map((img) => (
                        <GalleryCard key={img.id} image={img} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function CategoryPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      {label}
    </Link>
  );
}

function GalleryCard({ image }: { image: GalleryImageDto }) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const src = image.url.startsWith("http") ? image.url : `${base}${image.url}`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm">
          #{image.order}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-xs text-gray-600">{image.alt}</p>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/gallery/${image.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <DeleteGalleryButton id={image.id} label={image.alt} />
        </div>
      </div>
    </div>
  );
}
