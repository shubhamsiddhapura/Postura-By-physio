"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

function renderWithBr(value: ReactNode) {
  if (typeof value !== "string") return value;
  const parts = value.split(/<br\s*\/?>/gi);
  if (parts.length === 1) return value;
  return parts.map((part, idx) => (
    <Fragment key={idx}>
      {part}
      {idx < parts.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

export type AdvancedTreatmentItem = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export type AdvancedTreatmentCarouselProps = {
  id?: string;
  className?: string;
  backgroundClassName?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: AdvancedTreatmentItem[];
  showControls?: boolean;
};

function scrollByCard(container: HTMLDivElement, direction: -1 | 1) {
  const firstCard = container.querySelector<HTMLElement>("[data-treatment-card]");
  const delta = (firstCard?.offsetWidth ?? 320) + 24;
  container.scrollBy({ left: direction * delta, behavior: "smooth" });
}

export function AdvancedTreatmentCarousel({
  id = "advanced-treatments",
  className,
  backgroundClassName = "bg-[#DDF0F0]",
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
  showControls = true,
}: AdvancedTreatmentCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [edgeFaded, setEdgeFaded] = useState<Set<number>>(() => new Set());

  const canScroll = items.length > 3 && showControls;
  const paddedItems = useMemo(() => items, [items]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const containerRect = el.getBoundingClientRect();
        const thresholdPx = 12; // how much "clipped" counts as edge fade (smaller = less often faded)
        const next = new Set<number>();

        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-treatment-card]"));
        cards.forEach((card, idx) => {
          const r = card.getBoundingClientRect();
          const isVisible = r.right > containerRect.left && r.left < containerRect.right;
          if (!isVisible) return;

          const clippedLeft = r.left < containerRect.left + thresholdPx;
          const clippedRight = r.right > containerRect.right - thresholdPx;
          if (clippedLeft || clippedRight) next.add(idx);
        });

        setEdgeFaded(next);
      });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [paddedItems.length]);

  const onPrev = useCallback(() => {
    if (!scrollerRef.current) return;
    scrollByCard(scrollerRef.current, -1);
  }, []);

  const onNext = useCallback(() => {
    if (!scrollerRef.current) return;
    scrollByCard(scrollerRef.current, 1);
  }, []);

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
      <div className="py-10 md:py-10">
        <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end pt-10 mx-auto max-w-[90vw] px-4 text-center md:text-left">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={120} className="md:justify-self-end">
            <p className="max-w-xl text-sm leading-6 text-gray-500 md:mt-2 md:text-right">{renderWithBr(description)}</p>
          </FadeIn>
        </div>

        <FadeIn direction="up" distance={18} duration={800} delay={60}>
          <div className="relative mt-20">
            <div
              ref={scrollerRef}
              className={cn(
                // padding allows first/last card to fully reach viewport (no permanent fade)
                "flex gap-6 overflow-x-auto px-10 md:px-16 [perspective:1200px]",
                "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "snap-x snap-mandatory",
              )}
            >
              {paddedItems.map((item, idx) => (
                <div
                  key={item.title}
                  data-treatment-card
                  className={cn(
                    "snap-center",
                    "w-[220px] shrink-0 md:w-[320px]",
                    "transform-gpu transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    edgeFaded.has(idx) ? "opacity-55 scale-[0.95]" : "opacity-100 scale-100",
                  )}
                >
                  {item.href ? (
                    <Link href={item.href} aria-label={typeof item.title === "string" ? item.title : "Open item"}>
                      <div className="relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-white shadow-sm">
                        <div className="relative aspect-square">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 220px, 300px"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary shadow-sm">
                          <ArrowUpRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-white shadow-sm">
                        <div className="relative aspect-square">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 220px, 300px"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary shadow-sm">
                          <ArrowUpRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {showControls ? (
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
        ) : null}

      </div>
    </section>
  );
}

