"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";

/**
 * Rendered shape for a single card. Matches the public DTO but limited to
 * the fields actually shown so the component can be reused anywhere.
 *
 * `avatar` may be `null` for stories submitted via the public
 * share-your-story form when the patient skipped the photo. The card
 * falls back to a friendly initials avatar in that case.
 */
export type TestimonialCard = {
  tag: string;
  quote: string;
  name: string;
  age: number;
  avatar: string | null;
  /** 1-5 stars. Older rows without this field fall back to 5. */
  rating?: number;
};

const PAGE_SIZE = 12;

function rangeWithEllipsis(current: number, total: number): Array<number | "…"> {
  // Always show: 1, last, current, ±1 around current (with ellipses).
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]!;
    const prev = sorted[i - 1];
    if (i > 0 && prev && p - prev > 1) out.push("…");
    out.push(p);
  }
  // Ensure we don't end up with a cramped "… 2" at start or "total-1 … total" at end.
  if (out[1] === "…") out.splice(1, 1, 2);
  if (out[out.length - 2] === "…") out.splice(out.length - 2, 1, total - 1);
  return out;
}

function StarRating({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rating: ${value} of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <Star
            key={n}
            className={
              filled
                ? "h-6 w-6 fill-[#FF9000] text-[#FF9000]"
                : "h-6 w-6 fill-gray-200 text-gray-200"
            }
            strokeWidth={0}
          />
        );
      })}
    </div>
  );
}

function clampRating(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 5;
  return Math.max(1, Math.min(5, Math.round(n)));
}

/**
 * Two-letter avatar fallback used when a patient submitted a testimonial
 * without uploading a photo. Mirrors the public share-your-story form
 * so the placeholder feels consistent across the site.
 */
function testimonialInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function TestimonialsReviewsSection({
  items,
}: {
  items: TestimonialCard[];
}) {
  const [page, setPage] = useState(1);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(items.length / PAGE_SIZE)), [items.length]);
  const currentPage = Math.min(page, pageCount);
  const visible = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  const goToPage = (p: number) => {
    const next = Math.max(1, Math.min(pageCount, p));
    setPage(next);
    // Keep context: after switching pages, bring the grid back into view.
    // This is especially helpful on mobile where the pagination may be below the fold.
    document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="customer-reviews" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-8 md:grid-cols-[1fr,1.1fr] md:items-end">
          <FadeIn direction="up" distance={32} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">Customer Reviews</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Real Experiences. Real<br /> Results.
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100} className="md:justify-self-end">
            <p className="text-center text-sm leading-7 text-gray-500 md:text-left md:text-base">
              Discover how our personalized physiotherapy and wellness programs have helped individuals recover, stay
              active, and improve their quality of life.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visible.map((t, index) => (
            <FadeIn key={`${t.name}-${t.age}-${index}`} direction="up" distance={24} duration={700} delay={index * 35}>
              <article className="flex h-full flex-col rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-[#fafafa] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <StarRating value={clampRating(t.rating)} />
                  <span className="shrink-0 rounded-full border border-black px-3 py-1 text-xs font-medium text-gray-900">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-5 flex-1 text-sm leading-7 text-gray-900 md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-tl-[12px] rounded-br-[12px] rounded-tr-[4px] rounded-bl-[4px] bg-gray-100 ring-1 ring-black/5">
                    {t.avatar ? (
                      <Image src={t.avatar} alt={`${t.name} avatar`} fill className="object-cover" sizes="44px" />
                    ) : (
                      <span className="text-xs font-semibold uppercase text-gray-500">
                        {testimonialInitials(t.name)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}{" "}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {pageCount > 1 ? (
          <FadeIn direction="up" distance={20} duration={700} delay={120}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 md:mt-14">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  currentPage <= 1
                    ? "cursor-not-allowed border-gray-200 text-gray-300"
                    : "border-gray-200 text-gray-900 hover:bg-gray-50",
                ].join(" ")}
                aria-label="Previous page"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {rangeWithEllipsis(currentPage, pageCount).map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={[
                        "grid h-10 min-w-10 place-items-center rounded-full border text-sm font-semibold transition",
                        p === currentPage
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-900 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pageCount}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  currentPage >= pageCount
                    ? "cursor-not-allowed border-gray-200 text-gray-300"
                    : "border-gray-200 text-gray-900 hover:bg-gray-50",
                ].join(" ")}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
