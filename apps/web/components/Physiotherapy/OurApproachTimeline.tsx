"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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

export type ApproachStep = {
  key: string;
  title: string;
  /** Desktop placement (matches current design). */
  position?: "top" | "bottom";
};

export type OurApproachTimelineProps = {
  id?: string;
  className?: string;
  backgroundClassName?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  steps: ApproachStep[];
};

export function OurApproachTimeline({
  id = "our-approach",
  className,
  backgroundClassName = "bg-white",
  eyebrow = "How it Works",
  title = (
    <>
      Our Approach to
      <br /> Physiotherapy
    </>
  ),
  description = (
    <>
      A structured and progressive rehabilitation
      <br />
      process designed for complete recovery.
    </>
  ),
  steps,
}: OurApproachTimelineProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.25 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const shouldAnimate = inView && !reducedMotion;

  return (
    <section ref={sectionRef} id={id} className={cn(backgroundClassName, className)}>
      <div className="mx-auto max-w-[90vw] px-4 pt-16 md:pt-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100}>
            <div className="space-y-4 text-center text-sm leading-7 text-gray-500 md:text-left">
              <p>{renderWithBr(description)}</p>
            </div>
          </FadeIn>
        </div>

        {/* Mobile: vertical timeline (matches screenshot) */}
        <div className="relative mt-10 pb-10 md:hidden">
          {/* vertical dashed line */}
          <div
            aria-hidden
            className={cn("timeline-dash timeline-dash--v absolute left-10 top-2 bottom-2 w-1 -translate-x-1/2", shouldAnimate && "timeline-dash--active")}
          />

          <div className="space-y-10">
            {steps.map((step, idx) => (
              <FadeIn
                key={step.key}
                direction="up"
                distance={22}
                duration={650}
                delay={120 + idx * 90}
              >
                <div className="relative pl-40">
                {/* intersection dot on dashed line */}
                  <div
                    className={cn(
                      "absolute left-10 top-9 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary transition-transform duration-500",
                      shouldAnimate ? "scale-100" : "scale-0",
                    )}
                  />

                {/* connector from line to step marker */}
                <div className="absolute left-10 top-10 z-0 h-px w-28 bg-primary" />

                {/* ring dot at end of connector */}
                  <div
                    className={cn(
                      "absolute left-36 top-10 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-white transition-transform duration-500",
                      shouldAnimate ? "scale-100" : "scale-0",
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                <div className="pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                    {step.key}
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-900">{step.title}</div>
                </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Desktop: keep existing horizontal design */}
        <div className="relative mt-48 hidden md:block">
          <div
            aria-hidden
            className={cn("timeline-dash timeline-dash--h absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 h-1", shouldAnimate && "timeline-dash--active")}
          />

          <div className="relative z-10 grid grid-cols-5">
            {steps.map((step, idx) => {
              const isTop = (step.position ?? "top") === "top";
              return (
                <FadeIn
                  key={step.key}
                  direction={isTop ? "up" : "down"}
                  distance={26}
                  duration={650}
                  delay={150 + idx * 110}
                >
                  <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-transform duration-500",
                      shouldAnimate ? "scale-100" : "scale-0",
                    )}
                  />

                  <div
                    className={[
                      "absolute left-1/2 z-10 w-px -translate-x-1/2 bg-primary",
                      isTop ? "top-[calc(50%-1px)] h-20 -translate-y-full" : "top-[calc(50%+1px)] h-20",
                    ].join(" ")}
                  />

                  <div
                    className={[
                      cn(
                        "absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-white transition-transform duration-500",
                        shouldAnimate ? "scale-100" : "scale-0",
                      ),
                      isTop ? "top-[calc(50%-5rem)] -translate-y-1/2" : "top-[calc(50%+5rem)] -translate-y-1/2",
                    ].join(" ")}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <div className={["flex flex-col items-center", isTop ? "-translate-y-[8.75rem]" : "translate-y-[8.75rem]"].join(" ")}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                      {step.key}
                    </div>
                    <div className="mt-3 text-center text-md font-semibold text-slate-900">{step.title}</div>
                  </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local styles: animated dashed line (no solid overlay). */}
      <style jsx>{`
        .timeline-dash {
          --dash: #d9d9d9;
          --gap: transparent;
          --dashSize: 12px;
          --gapSize: 10px;
          opacity: 1;
        }
        .timeline-dash--v {
          background-image: repeating-linear-gradient(
            to bottom,
            var(--dash) 0,
            var(--dash) var(--dashSize),
            var(--gap) var(--dashSize),
            var(--gap) calc(var(--dashSize) + var(--gapSize))
          );
          background-size: 100% calc(var(--dashSize) + var(--gapSize));
          background-position: 0 0;
        }
        .timeline-dash--h {
          background-image: repeating-linear-gradient(
            to right,
            var(--dash) 0,
            var(--dash) var(--dashSize),
            var(--gap) var(--dashSize),
            var(--gap) calc(var(--dashSize) + var(--gapSize))
          );
          background-size: calc(var(--dashSize) + var(--gapSize)) 100%;
          background-position: 0 0;
        }

        .timeline-dash--active.timeline-dash--v {
          animation: timelineDashV 1.2s linear 1 both;
        }
        .timeline-dash--active.timeline-dash--h {
          animation: timelineDashH 1.2s linear 1 both;
        }

        @keyframes timelineDashV {
          to {
            background-position: 0 calc(var(--dashSize) + var(--gapSize));
          }
        }
        @keyframes timelineDashH {
          to {
            background-position: calc(var(--dashSize) + var(--gapSize)) 0;
          }
        }
      `}</style>
    </section>
  );
}

