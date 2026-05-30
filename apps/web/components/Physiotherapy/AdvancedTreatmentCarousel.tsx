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
  /**
   * Enables continuous auto-scroll when > 0.
   * This value represents speed in px/sec (default 36). Set 0 to disable.
   */
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
  autoScrollInterval = 80,
  scrollBatch = 4,
}: AdvancedTreatmentCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);
  const manualPauseRef = useRef(false);
  const manualPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Duplicate items so we can smooth-scroll into the copy and snap back invisibly
  const loopItems = [...items, ...items];

  // ── Seamless continuous auto-scroll (pause on hover) ──────────────────────
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = () => setPrefersReducedMotion(mq.matches);
    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    const legacyMq = mq as unknown as {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    if (typeof legacyMq.addListener === "function") {
      legacyMq.addListener(onChange);
      return () => {
        if (typeof legacyMq.removeListener === "function") legacyMq.removeListener(onChange);
      };
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(max-width: 767px)");
    if (!mq) return;

    const onChange = () => setIsMobile(mq.matches);
    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    const legacyMq = mq as unknown as {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    if (typeof legacyMq.addListener === "function") {
      legacyMq.addListener(onChange);
      return () => {
        if (typeof legacyMq.removeListener === "function") legacyMq.removeListener(onChange);
      };
    }
  }, []);

  const isAutoScrollEnabled =
    (autoScrollInterval ?? 0) > 0 && items.length > 1 && !prefersReducedMotion;

  const pauseAutoFor = useCallback((ms: number) => {
    if (!isAutoScrollEnabled) return;
    manualPauseRef.current = true;
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      manualPauseRef.current = false;
      lastTsRef.current = null; // avoid large dt jump after pause
    }, ms);
  }, [isAutoScrollEnabled]);

  useEffect(() => {
    const speedPxPerSec = autoScrollInterval ?? 0;
    if (!speedPxPerSec || speedPxPerSec <= 0) return;
    if (items.length <= 1) return;
    if (prefersReducedMotion) return;

    const el = scrollerRef.current;
    if (!el) return;

    const loopWidth = el.scrollWidth / 2; // because we render [...items, ...items]

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dtMs = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!hoveredRef.current && !manualPauseRef.current) {
        el.scrollLeft += (speedPxPerSec * dtMs) / 1000;

        // If we've fully scrolled into the duplicated half, snap back by exactly one loop.
        if (el.scrollLeft >= loopWidth) {
          el.scrollLeft -= loopWidth;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [autoScrollInterval, items.length, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    };
  }, []);

  // ── Manual controls ───────────────────────────────────────────────────────
  const onPrev = useCallback(() => {
    pauseAutoFor(2500);
    const el = scrollerRef.current;
    if (!el) return;
    const cardW = getCardWidth(el);
    const step = (isMobile ? 1 : scrollBatch) * cardW;
    el.scrollBy({ left: -step, behavior: "smooth" });
  }, [isMobile, pauseAutoFor, scrollBatch]);

  const onNext = useCallback(() => {
    pauseAutoFor(2500);
    const el = scrollerRef.current;
    if (!el) return;
    const cardW = getCardWidth(el);
    const step = (isMobile ? 1 : scrollBatch) * cardW;
    el.scrollBy({ left: step, behavior: "smooth" });
  }, [isMobile, pauseAutoFor, scrollBatch]);

  const canScroll = items.length > 1 && showControls;

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
      <div className="py-10 md:py-10">
        {/* Header */}
        <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end pt-10 mx-auto max-w-[90vw] px-4 text-center md:text-left">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
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
                !isAutoScrollEnabled && "snap-x snap-mandatory scroll-smooth",
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
                      "opacity-100",
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
