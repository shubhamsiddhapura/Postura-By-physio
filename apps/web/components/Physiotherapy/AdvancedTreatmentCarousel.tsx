"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

export type AdvancedTreatmentItem = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export type AdvancedTreatmentCarouselProps = {
  id?: string;
  className?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: AdvancedTreatmentItem[];
};

function scrollByCard(container: HTMLDivElement, direction: -1 | 1) {
  const firstCard = container.querySelector<HTMLElement>("[data-treatment-card]");
  const delta = (firstCard?.offsetWidth ?? 320) + 24;
  container.scrollBy({ left: direction * delta, behavior: "smooth" });
}

export function AdvancedTreatmentCarousel({
  id = "advanced-treatments",
  className,
  eyebrow = "Treatments",
  title = (
    <>
      Advanced Treatment
      <br />
      Techniques
    </>
  ),
  description = "We use evidence-based methods to ensure effective and safe recovery.",
  items,
}: AdvancedTreatmentCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const canScroll = items.length > 3;
  const paddedItems = useMemo(() => items, [items]);

  const onPrev = useCallback(() => {
    if (!scrollerRef.current) return;
    scrollByCard(scrollerRef.current, -1);
  }, []);

  const onNext = useCallback(() => {
    if (!scrollerRef.current) return;
    scrollByCard(scrollerRef.current, 1);
  }, []);

  return (
    <section id={id} className={cn("bg-[#DDF0F0]", className)}>
      <div className="py-10 md:py-10">
        <div className="grid gap-10 md:grid-cols-[1fr,1.15fr] md:items-end pt-10 mx-auto max-w-[90vw] px-4 ">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={120} className="md:justify-self-end">
            <p className="max-w-xl text-sm leading-6 text-gray-500 md:mt-2 md:text-right">{description}</p>
          </FadeIn>
        </div>

        <FadeIn direction="up" distance={18} duration={800} delay={60}>
          <div className="relative mt-20">
            {/* edge fades to mimic screenshot */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#DDF0F0] to-transparent md:w-40" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#DDF0F0] to-transparent md:w-40" />

            <div
              ref={scrollerRef}
              className={cn(
                "flex gap-6 overflow-x-auto",
                "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "snap-x snap-mandatory",
              )}
            >
              {paddedItems.map((item) => (
                <div
                  key={item.title}
                  data-treatment-card
                  className={cn("snap-start", "w-[220px] shrink-0 md:w-[260px]")}
                >
                  <div className="relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-white shadow-sm">
                    <div className="relative aspect-square">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 220px, 260px"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary shadow-sm">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-10 flex items-center justify-end gap-2 md:mt-10 mx-auto max-w-[90vw] px-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canScroll}
            aria-label="Previous"
            className="grid h-10 w-10 place-items-center rounded-full border border-secondary text-secondary shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canScroll}
            aria-label="Next"
            className="grid h-10 w-10 place-items-center rounded-full border border-secondary text-secondary shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

