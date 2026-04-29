"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Auto-scroll interval in ms (default 3000). Set 0 to disable. */
  autoScrollInterval?: number;
  /** Cards to advance per tick (default 4). */
  scrollBatch?: number;
};

const CARD_GAP = 24;

function scrollToCard(
  container: HTMLDivElement,
  index: number,
  behavior: ScrollBehavior,
) {
  const cards = container.querySelectorAll<HTMLElement>("[data-treatment-card]");
  const card = cards[index];
  if (!card) return;
  container.scrollTo({ left: card.offsetLeft, behavior });
}

function getCardWidth(container: HTMLDivElement): number {
  const card = container.querySelector<HTMLElement>("[data-treatment-card]");
  return card ? card.offsetWidth + CARD_GAP : 300 + CARD_GAP;
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
  autoScrollInterval = 3000,
  scrollBatch = 4,
}: AdvancedTreatmentCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [edgeFaded, setEdgeFaded] = useState<Set<number>>(() => new Set());
  const hoveredRef = useRef(false);
  const batchStartRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duplicate items so we can smooth-scroll into the copy and snap back invisibly
  const loopItems = [...items, ...items];

  // ── Edge-fade tracker ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const containerRect = el.getBoundingClientRect();
        const threshold = 24;
        const next = new Set<number>();
        const cards = Array.from(
          el.querySelectorAll<HTMLElement>("[data-treatment-card]"),
        );
        cards.forEach((card, idx) => {
          const r = card.getBoundingClientRect();
          const visible =
            r.right > containerRect.left && r.left < containerRect.right;
          if (!visible) return;
          if (
            r.left < containerRect.left - threshold ||
            r.right > containerRect.right + threshold
          )
            next.add(idx);
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
  }, [loopItems.length]);

  // ── Seamless 360 auto-scroll ──────────────────────────────────────────────
  useEffect(() => {
    if (!autoScrollInterval || autoScrollInterval <= 0) return;

    const timer = setInterval(() => {
      if (hoveredRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;

      const nextStart = batchStartRef.current + scrollBatch;

      if (nextStart >= items.length) {
        // Smooth-scroll to the duplicate copy of card 0 (looks identical to real card 0)
        scrollToCard(el, items.length, "smooth");
        batchStartRef.current = items.length;

        // After the smooth scroll finishes (~580ms), silently snap to real card 0
        if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
        snapTimerRef.current = setTimeout(() => {
          const container = scrollerRef.current;
          if (!container) return;
          container.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
          batchStartRef.current = 0;
        }, 580);
      } else {
        scrollToCard(el, nextStart, "smooth");
        batchStartRef.current = nextStart;
      }
    }, autoScrollInterval);

    return () => {
      clearInterval(timer);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, [autoScrollInterval, scrollBatch, items.length]);

  // ── Manual controls ───────────────────────────────────────────────────────
  const onPrev = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardW = getCardWidth(el);
    el.scrollBy({ left: -scrollBatch * cardW, behavior: "smooth" });
  }, [scrollBatch]);

  const onNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardW = getCardWidth(el);
    el.scrollBy({ left: scrollBatch * cardW, behavior: "smooth" });
  }, [scrollBatch]);

  const canScroll = items.length > 4 && showControls;

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
      <div className="py-10 md:py-10">
        {/* Header */}
        <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end pt-10 mx-auto max-w-[90vw] px-4 text-center md:text-left">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={120} className="md:justify-self-end">
            <p className="max-w-xl text-sm leading-6 text-gray-500 md:mt-2 md:text-right">
              {renderWithBr(description)}
            </p>
          </FadeIn>
        </div>

        {/* Carousel */}
        <FadeIn direction="up" distance={18} duration={800} delay={60}>
          <div
            className="relative mt-12"
            onMouseEnter={() => { hoveredRef.current = true; }}
            onMouseLeave={() => { hoveredRef.current = false; }}
          >
            <div
              ref={scrollerRef}
              className={cn(
                "flex gap-6 overflow-x-auto px-6 md:px-10 lg:px-12",
                "scroll-pl-6 md:scroll-pl-10 lg:scroll-pl-12",
                "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "snap-x snap-mandatory scroll-smooth",
              )}
            >
              {loopItems.map((item, idx) => {
                const isDuplicate = idx >= items.length;
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    data-treatment-card
                    aria-hidden={isDuplicate || undefined}
                    className={cn(
                      "snap-start shrink-0",
                      "basis-[78%] sm:basis-[46%] md:basis-[31%] lg:basis-[22.5%]",
                      "transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      edgeFaded.has(idx) ? "opacity-50" : "opacity-100",
                    )}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        aria-label={item.title}
                        tabIndex={isDuplicate ? -1 : 0}
                      >
                        <div className="relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-white shadow-sm">
                          <div className="relative aspect-square">
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 78vw, (max-width: 768px) 46vw, (max-width: 1024px) 31vw, 22vw"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary shadow-sm">
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
                              sizes="(max-width: 640px) 78vw, (max-width: 768px) 46vw, (max-width: 1024px) 31vw, 22vw"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary shadow-sm">
                            <ArrowUpRight className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Manual controls */}
        {showControls && (
          <div className="mt-10 flex items-center justify-end gap-2 mx-auto max-w-[90vw] px-4">
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
        )}
      </div>
    </section>
  );
}
