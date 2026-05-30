"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryCategory } from "@repo/types";
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS } from "@repo/types";

import { GalleryMasonrySection } from "./GalleryMasonrySection";
import { GallerySplitFeatureSection } from "./GallerySplitFeatureSection";
import { YogaTherapySection } from "./YogaTherapySection";
import { PilatesTherapySection } from "./PilatesTherapySection";
import { CorporateWelnessProgramSection } from "./CorporateWelnessProgramSection";
import { Footer } from "../Home/Footer";

type GalleryTile = { src: string; alt: string };

type Props = {
  imagesByCategory: Record<GalleryCategory, GalleryTile[]>;
};

const PER_PAGE = 24;

export function GalleryCategoryBrowser({ imagesByCategory }: Props) {
  const [active, setActive] = useState<"all" | GalleryCategory>("all");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
  }, [active]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active, page]);

  const activeImages = useMemo(() => {
    if (active === "all") return [];
    return imagesByCategory[active] ?? [];
  }, [active, imagesByCategory]);

  const totalPages = useMemo(() => {
    if (active === "all") return 1;
    return Math.max(1, Math.ceil(activeImages.length / PER_PAGE));
  }, [active, activeImages.length]);

  const pageImages = useMemo(() => {
    if (active === "all") return [];
    const start = (page - 1) * PER_PAGE;
    return activeImages.slice(start, start + PER_PAGE);
  }, [active, activeImages, page]);

  return (
    <div ref={topRef}>
      <div
        className="mx-auto w-full max-w-[90vw] px-4 pt-10"
        aria-label="Gallery categories"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <CategoryPill
            label="All"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {GALLERY_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={GALLERY_CATEGORY_LABELS[cat]}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          ))}
        </div>
      </div>

      {active === "all" ? (
        <>
          <GalleryMasonrySection
            category="physiotherapy"
            sectionTitle="Physiotherapy Sessions Section"
            images={imagesByCategory.physiotherapy}
          />
          <GallerySplitFeatureSection
            sectionTitle="Aerobics Classes Section"
            images={imagesByCategory.aerobics}
          />
          <YogaTherapySection
            sectionTitle="Yoga Therapy Section"
            images={imagesByCategory.yoga}
          />
          <PilatesTherapySection
            sectionTitle="Pilates Therapy Section"
            images={imagesByCategory.pilates}
          />
          <CorporateWelnessProgramSection
            sectionTitle="Corporate Wellness Program Section"
            images={imagesByCategory.corporate}
          />
          <Footer />
        </>
      ) : (
        <>
          <CategoryPagedMasonry
            title={`${GALLERY_CATEGORY_LABELS[active]} Gallery`}
            images={pageImages}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onPage={(p) => setPage(p)}
          />
          <Footer />
        </>
      )}
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm font-medium md:px-5 md:py-2.5",
        "transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-primary bg-transparent text-primary hover:bg-primary/5",
      ].join(" ")}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function CategoryPagedMasonry({
  title,
  images,
}: {
  title: string;
  images: GalleryTile[];
}) {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mx-auto w-full max-w-[90vw] px-4">
        <div className="relative my-10 flex items-center justify-center md:my-12">
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
            aria-hidden
          />
          <div className="relative flex items-center gap-2 bg-white px-3 md:px-4">
            <Image
              src="/sparkle.svg"
              alt="Sparkle icon"
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-center text-sm font-medium text-primary md:text-[15px]">
              {title}
            </span>
          </div>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img) => (
            <div
              key={img.src}
              className="mb-4 break-inside-avoid overflow-hidden bg-gray-100 rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            >
              <div className="relative w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 92vw"
                />
              </div>
            </div>
          ))}
          {images.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No images found in this category yet.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = getPaginationPages(page, totalPages);

  return (
    <div className="bg-white px-4 pb-10">
      <div className="mx-auto flex w-full max-w-[90vw] items-center justify-center gap-2 px-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {pages.map((p, idx) =>
            p === "…" ? (
              <span key={`e-${idx}`} className="px-2 text-primary/70">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPage(p)}
                className={[
                  "min-w-10 rounded-full border px-3 py-2 text-sm font-medium",
                  p === page
                    ? "border-primary bg-primary text-white"
                    : "border-primary bg-transparent text-primary hover:bg-primary/5",
                ].join(" ")}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function getPaginationPages(
  current: number,
  total: number,
): Array<number | "…"> {
  const clamp = (n: number) => Math.max(1, Math.min(total, n));
  const windowStart = clamp(current - 1);
  const windowEnd = clamp(current + 1);

  const out: Array<number | "…"> = [];
  const push = (v: number | "…") => out.push(v);

  push(1);
  if (windowStart > 2) push("…");

  for (let p = windowStart; p <= windowEnd; p++) {
    if (p !== 1 && p !== total) push(p);
  }

  if (windowEnd < total - 1) push("…");
  if (total !== 1) push(total);

  // de-dupe adjacent duplicates (can happen near edges)
  return out.filter((v, i) => (i === 0 ? true : out[i - 1] !== v));
}

