"use client";

import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

/** ms between each successive step appearing */
const STEP_DELAY = 520;
/** ms all steps stay fully visible before resetting */
const HOLD_MS = 2400;
/** ms gap (at-line state) before the next loop starts */
const RESET_PAUSE_MS = 380;

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
  const [visibleCount, setVisibleCount] = useState(0);
  const [resetting, setResetting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion =
    typeof window !== "undefined"
      ? (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
      : false;

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(steps.length);
      return;
    }

    const clear = () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };

    const showStep = (n: number) => {
      setVisibleCount(n);
      if (n < steps.length) {
        timerRef.current = setTimeout(() => showStep(n + 1), STEP_DELAY);
      } else {
        // all steps visible — hold, then reset
        timerRef.current = setTimeout(() => {
          // 1. disable transitions so snap-back is instant
          setResetting(true);
          timerRef.current = setTimeout(() => {
            // 2. snap all steps back to line (no transition)
            setVisibleCount(0);
            timerRef.current = setTimeout(() => {
              // 3. re-enable transitions and start next loop
              setResetting(false);
              timerRef.current = setTimeout(() => showStep(1), 60);
            }, RESET_PAUSE_MS);
          }, 30);
        }, HOLD_MS);
      }
    };

    timerRef.current = setTimeout(() => showStep(1), 400);
    return clear;
  }, [steps.length, reducedMotion]);

  const isVisible = (idx: number) => idx < visibleCount;

  // Shared transition style (disabled during the instant snap-back)
  const tx: CSSProperties = resetting
    ? { transition: "none" }
    : {
        transition:
          "transform 0.55s cubic-bezier(0.34,1.42,0.64,1), opacity 0.45s ease",
      };

  // Desktop: step content animates from the line (translateY 0) to final offset
  const desktopContentStyle = (idx: number, isTop: boolean): CSSProperties => ({
    ...tx,
    transform: isVisible(idx)
      ? isTop
        ? "translateY(-8.75rem)"
        : "translateY(8.75rem)"
      : "translateY(0)",
    opacity: isVisible(idx) ? 1 : 0,
  });

  // Desktop: dot + connector fade in together with the step
  const dotStyle = (idx: number): CSSProperties => ({
    ...tx,
    opacity: isVisible(idx) ? 1 : 0,
    transform: isVisible(idx) ? "scale(1) translate(-50%, -50%)" : "scale(0) translate(-50%, -50%)",
  });

  const lineDotStyle = (idx: number): CSSProperties => ({
    ...tx,
    opacity: isVisible(idx) ? 1 : 0,
    transform: isVisible(idx) ? "scale(1) translateX(-50%)" : "scale(0) translateX(-50%)",
  });

  // Mobile: step slides up from the connector line
  const mobileStepStyle = (idx: number): CSSProperties => ({
    ...tx,
    transform: isVisible(idx) ? "translateY(0)" : "translateY(1.75rem)",
    opacity: isVisible(idx) ? 1 : 0,
  });

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
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

        {/* ── Mobile: vertical timeline ─────────────────────────────────── */}
        <div className="relative mt-10 pb-10 md:hidden">
          {/* vertical dashed line */}
          <div
            aria-hidden
            className="timeline-dash timeline-dash--v timeline-dash--loop absolute bottom-2 left-10 top-2 w-1 -translate-x-1/2"
          />

          <div className="space-y-10">
            {steps.map((step, idx) => (
              <div key={step.key} className="relative pl-40">
                {/* intersection dot on dashed line */}
                <div
                  style={lineDotStyle(idx)}
                  className="absolute left-10 top-9 z-10 h-2.5 w-2.5 rounded-full bg-primary"
                />
                {/* connector from line to step marker */}
                <div
                  style={{ ...tx, opacity: isVisible(idx) ? 1 : 0 }}
                  className="absolute left-10 top-10 z-0 h-px w-28 bg-primary"
                />
                {/* ring dot at end of connector */}
                <div
                  style={dotStyle(idx)}
                  className="absolute left-36 top-10 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* step label — slides up from the line */}
                <div style={mobileStepStyle(idx)} className="pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                    {step.key}
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-900">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: horizontal timeline ──────────────────────────────── */}
        <div className="relative mt-48 hidden md:block">
          <div
            aria-hidden
            className="timeline-dash timeline-dash--h timeline-dash--loop absolute left-0 right-0 top-1/2 z-0 h-1 -translate-y-1/2"
          />

          <div className="relative z-10 grid grid-cols-5">
            {steps.map((step, idx) => {
              const isTop = (step.position ?? "top") === "top";
              return (
                <div key={step.key} className="relative flex flex-col items-center">
                  {/* centre dot on the line */}
                  <div
                    style={lineDotStyle(idx)}
                    className="absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 rounded-full bg-primary"
                  />

                  {/* vertical connector */}
                  <div
                    style={{ ...tx, opacity: isVisible(idx) ? 1 : 0 }}
                    className={cn(
                      "absolute left-1/2 z-10 w-px -translate-x-1/2 bg-primary",
                      isTop
                        ? "top-[calc(50%-1px)] h-20 -translate-y-full"
                        : "top-[calc(50%+1px)] h-20",
                    )}
                  />

                  {/* ring dot at end of connector */}
                  <div
                    style={dotStyle(idx)}
                    className={cn(
                      "absolute left-1/2 z-20 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white",
                      isTop
                        ? "top-[calc(50%-5rem)] -translate-y-1/2"
                        : "top-[calc(50%+5rem)] -translate-y-1/2",
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* step content — animates from line to final offset */}
                  <div
                    style={desktopContentStyle(idx, isTop)}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                      {step.key}
                    </div>
                    <div className="mt-3 text-center text-md font-semibold text-slate-900">
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local styles: looping animated dashed line */}
      <style jsx>{`
        .timeline-dash {
          --dash: #d9d9d9;
          --gap: transparent;
          --dashSize: 12px;
          --gapSize: 10px;
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
        .timeline-dash--loop.timeline-dash--v {
          animation: timelineDashV 1.4s linear infinite;
        }
        .timeline-dash--loop.timeline-dash--h {
          animation: timelineDashH 1.4s linear infinite;
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
