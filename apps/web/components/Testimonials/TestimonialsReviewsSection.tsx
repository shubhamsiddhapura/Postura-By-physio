"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

/**
 * Rendered shape for a single card. Matches the public DTO but limited to
 * the fields actually shown so the component can be reused anywhere.
 */
export type TestimonialCard = {
  tag: string;
  quote: string;
  name: string;
  age: number;
  avatar: string;
  /** 1-5 stars. Older rows without this field fall back to 5. */
  rating?: number;
};

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 6;

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

export function TestimonialsReviewsSection({
  items,
}: {
  items: TestimonialCard[];
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const canShowMore = visibleCount < items.length;

  const handleViewMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, items.length));
  };

  return (
    <section id="customer-reviews" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-8 md:grid-cols-[1fr,1.1fr] md:items-end">
          <FadeIn direction="up" distance={32} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
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
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-tl-[12px] rounded-br-[12px] rounded-tr-[4px] rounded-bl-[4px] ring-1 ring-black/5">
                    <Image src={t.avatar} alt="" fill className="object-cover" sizes="44px" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}{" "}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {canShowMore ? (
          <FadeIn direction="up" distance={20} duration={700} delay={120}>
            <div className="mt-14 flex justify-center md:mt-16">
              <PrimaryCTAButton
                href="#customer-reviews"
                label="View More"
                size="md"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  handleViewMore();
                }}
              />
            </div>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
