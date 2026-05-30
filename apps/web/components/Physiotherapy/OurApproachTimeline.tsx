"use client";

import type { CSSProperties, ReactNode } from "react";
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

/** Main dot drifts smoothly along the full line (desktop L→R, mobile T→B) */
const CARRIER_TOTAL_MS = 11000;
/** Start both carrier + peel timers after the same small delay */
const CARRIER_START_DELAY_MS = 90;
/** Carrier ring size (matches `h-4 w-4`) */
const CARRIER_RING_PX = 16;
/** Flying dot from junction → ring dot */
const PEEL_MS = 1200;
/** Match peel transform end before clearing flying dot */
const PEEL_SETTLE_MS = 70;
/** Pause after full cycle before restarting from step 1 */
const CYCLE_PAUSE_MS = 1700;

function columnCenterPct(idx: number, n: number) {
  if (n <= 0) return 0;
  return ((idx + 0.5) / n) * 100;
}

/** Time when linear carrier crosses column `idx` centre (matches CSS animation) */
function junctionArrivalMs(idx: number, n: number) {
  if (n <= 0) return 0;
  return CARRIER_TOTAL_MS * ((idx + 0.5) / n);
}

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
  const n = steps.length;
  const gridColsStyle: CSSProperties =
    n > 0 ? { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } : {};

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Tablet (768–1023px) keeps the vertical timeline but stretches the
  // connector so the ring + step content fill the available width instead
  // of clustering on the left. Drives the inline peel transform distance
  // to match the longer arm at this width.
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    setIsTablet(mq.matches);
    const onChange = () => setIsTablet(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /**
   * Mobile measurement:
   * - mobileSectionRef → the always-rendered outer mobile section (never null)
   * - mobileJunctionRefs → the tiny dot on the dashed line for each step
   * We compute fractions relative to the carrier's actual travel path:
   *   carrier top-2 offset = 8px, bottom-2 offset = 8px (Tailwind spacing-2 = 0.5rem = 8px)
   *   carrier center starts at sectionTop + 8 + halfRing, ends at sectionBottom - 8 - halfRing
   */
  const MOBILE_LANE_OFFSET_PX = 8; // top-2 / bottom-2
  const mobileSectionRef = useRef<HTMLDivElement | null>(null);
  const mobilePathRef = useRef<HTMLDivElement | null>(null); // kept for carrier wrapper
  const mobileJunctionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [mobileFractions, setMobileFractions] = useState<number[]>([]);

  const setMobileJunctionRef = (idx: number) => (el: HTMLDivElement | null) => {
    mobileJunctionRefs.current[idx] = el;
  };

  useEffect(() => {
    if (isDesktop) return;

    const section = mobileSectionRef.current;
    if (!section) return;

    const compute = () => {
      const sr = section.getBoundingClientRect();
      const halfRing = CARRIER_RING_PX / 2;
      // carrier center travels from this Y to this Y
      const pathTop = sr.top + MOBILE_LANE_OFFSET_PX + halfRing;
      const pathBottom = sr.bottom - MOBILE_LANE_OFFSET_PX - halfRing;
      const pathLen = Math.max(1, pathBottom - pathTop);

      const fracs = Array.from({ length: n }, (_, i) => {
        const el = mobileJunctionRefs.current[i];
        if (!el) return junctionArrivalMs(i, n) / CARRIER_TOTAL_MS;
        const r = el.getBoundingClientRect();
        const centerY = r.top + r.height / 2;
        const f = (centerY - pathTop) / pathLen;
        return Math.min(0.995, Math.max(0.005, f));
      });
      setMobileFractions(fracs);
    };

    // Run immediately (section is always rendered), then on resize
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(section);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [n, isDesktop]);

  // Desktop: measure true junction X positions (in case layout/padding differs)
  const desktopPathRef = useRef<HTMLDivElement | null>(null);
  const desktopJunctionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [desktopFractions, setDesktopFractions] = useState<number[]>([]);

  const setDesktopJunctionRef = (idx: number) => (el: HTMLDivElement | null) => {
    desktopJunctionRefs.current[idx] = el;
  };

  useEffect(() => {
    if (!isDesktop) return;

    const lane = desktopPathRef.current;
    if (!lane) return;

    const compute = () => {
      const laneRect = lane.getBoundingClientRect();
      const w = Math.max(1, laneRect.width);
      const fracs = Array.from({ length: n }, (_, i) => {
        const el = desktopJunctionRefs.current[i];
        if (!el) return (i + 0.5) / Math.max(1, n);
        const r = el.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const f = (centerX - laneRect.left) / w;
        return Math.min(0.995, Math.max(0.005, f));
      });
      setDesktopFractions(fracs);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(lane);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [n, isDesktop]);

  /**
   * Remount carrier so linear drift restarts in sync with peel timers.
   * 0 = idle until first cycle arms (avoids animation/timer desync on mount).
   */
  const [motionCycleKey, setMotionCycleKey] = useState(0);

  const [peelingIdx, setPeelingIdx] = useState<number | null>(null);
  const [peelAnimOn, setPeelAnimOn] = useState(false);
  /** Steps whose ring keeps pinging until this interval ends */
  const [pingingSteps, setPingingSteps] = useState<number[]>([]);

  const arrivalTimesMs = useMemo(() => {
    if (n <= 0) return [];
    if (isDesktop) {
      return Array.from({ length: n }, (_, i) => {
        const f = desktopFractions[i];
        const base = typeof f === "number" ? f * CARRIER_TOTAL_MS : junctionArrivalMs(i, n);
        return CARRIER_START_DELAY_MS + base;
      });
    }
    // Mobile: use measured fractions (always available since mobileSectionRef never null)
    return Array.from({ length: n }, (_, i) => {
      const f = mobileFractions[i];
      const base = typeof f === "number" ? f * CARRIER_TOTAL_MS : junctionArrivalMs(i, n);
      return CARRIER_START_DELAY_MS + base;
    });
  }, [n, isDesktop, mobileFractions, desktopFractions]);

  // Keep arrival times in a ref so the peel loop always reads the latest value
  // even if fractions update after first render (ResizeObserver fires after mount).
  const arrivalTimesMsRef = useRef(arrivalTimesMs);
  useEffect(() => {
    arrivalTimesMsRef.current = arrivalTimesMs;
  }, [arrivalTimesMs]);

  useEffect(() => {
    if (n === 0 || reducedMotion) return;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    /** Wait long enough for carrier + last peel to finish (handles large step counts) */
    const cycleMotionMs =
      n > 0
        ? Math.max(
            CARRIER_START_DELAY_MS + CARRIER_TOTAL_MS,
            (arrivalTimesMs[n - 1] ?? junctionArrivalMs(n - 1, n)) + PEEL_MS + PEEL_SETTLE_MS + 120,
          )
        : CARRIER_TOTAL_MS;

    let cancelled = false;
    const peelTimeouts: number[] = [];

    const clearPeelTimeouts = () => {
      peelTimeouts.splice(0).forEach((id) => window.clearTimeout(id));
    };

    const schedulePeelsForCycle = () => {
      // Read from ref so we always get the latest measured fractions, not stale closure
      const times = arrivalTimesMsRef.current;
      for (let i = 0; i < n; i++) {
        const arrival = times[i] ?? (CARRIER_START_DELAY_MS + junctionArrivalMs(i, n));
        peelTimeouts.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setPeelingIdx(i);
            peelTimeouts.push(
              window.setTimeout(() => {
                if (cancelled) return;
                setPeelingIdx(null);
                setPingingSteps((prev) => (prev.includes(i) ? prev : [...prev, i]));
              }, PEEL_MS + PEEL_SETTLE_MS),
            );
          }, arrival),
        );
      }
    };

    const run = async () => {
      await wait(350);
      while (!cancelled) {
        clearPeelTimeouts();
        setPeelingIdx(null);
        setPingingSteps([]);
        setMotionCycleKey((k) => k + 1);
        // Arm peel timers on the same frame the carrier mounts so we don't drift late.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (cancelled) break;
        schedulePeelsForCycle();

        await wait(cycleMotionMs);
        if (cancelled) break;

        clearPeelTimeouts();
        setPeelingIdx(null);

        await wait(CYCLE_PAUSE_MS);
      }
    };

    run();

    return () => {
      cancelled = true;
      clearPeelTimeouts();
    };
  }, [n, reducedMotion]);

  useEffect(() => {
    if (peelingIdx === null) {
      setPeelAnimOn(false);
      return;
    }
    setPeelAnimOn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPeelAnimOn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [peelingIdx]);

  const flyingPeelTransition: CSSProperties = {
    transition: `transform ${PEEL_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
  };

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
      <div className="mx-auto max-w-[90vw] px-4 pt-16 md:pt-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
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

        {/* ── Mobile + tablet: vertical timeline (tablet stretches right) ─ */}
        <div ref={mobileSectionRef} className="relative mt-10 pb-10 md:mt-16 md:pb-16 lg:hidden">
          {/* vertical dashed line */}
          <div
            aria-hidden
            className="timeline-dash timeline-dash--v timeline-dash--loop absolute bottom-2 left-10 top-2 w-1 -translate-x-1/2"
          />

          {/* Sequential carrier + peel (hidden when reduced motion) */}
          {!reducedMotion && motionCycleKey > 0 ? (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-10 top-2 z-[14] w-0 -translate-x-1/2"
              ref={mobilePathRef}
            >
              <div
                key={motionCycleKey}
                className="approach-carrier-drift-v absolute left-1/2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"
                style={{
                  animationDuration: `${CARRIER_TOTAL_MS}ms`,
                  animationDelay: `${CARRIER_START_DELAY_MS}ms`,
                }}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            </div>
          ) : null}

          <div className="space-y-10 md:space-y-12">
            {steps.map((step, idx) => {
              const verticalPeelArm = isTablet ? "18rem" : "7rem";
              return (
                <div key={step.key} className="relative pl-40 md:pl-[21rem]">
                  {/* intersection dot on dashed line (static) */}
                  <div
                    ref={setMobileJunctionRef(idx)}
                    className="absolute left-10 top-10 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                  />
                  {/* connector from line to step marker */}
                  <div className="absolute left-10 top-10 z-0 h-px w-28 -translate-y-1/2 bg-primary md:w-72" />
                  {/* ring dot at end of connector */}
                  <div className="absolute left-[9.5rem] top-10 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible rounded-full border-2 border-primary bg-white md:left-[20.5rem]">
                    {!reducedMotion && pingingSteps.includes(idx) ? (
                      <>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/50 [animation-duration:0.95s]"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/35 [animation-delay:220ms] [animation-duration:1.65s]"
                        />
                      </>
                    ) : null}
                    <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* Flying peel: only for active step, sequential */}
                  {!reducedMotion && peelingIdx === idx ? (
                    <div
                      aria-hidden
                      className="absolute left-10 top-10 z-[16] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.92)]"
                      style={{
                        ...flyingPeelTransition,
                        transform: peelAnimOn
                          ? `translate(-50%, -50%) translateX(${verticalPeelArm})`
                          : "translate(-50%, -50%) translateX(0)",
                      }}
                    />
                  ) : null}

                  {/* step label — stacked on mobile, inline on tablet so the
                      title fills the empty right-hand space */}
                  <div className="pt-5 pl-5 md:flex md:items-center md:gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0] md:flex-shrink-0">
                      {step.key}
                    </div>
                    <div className="mt-3 text-base font-semibold text-slate-900 md:mt-0 md:text-lg">
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: horizontal timeline ──────────────────────────────── */}
        <div className="relative mt-48 hidden lg:block">
          <div
            aria-hidden
            className="timeline-dash timeline-dash--h timeline-dash--loop absolute left-0 right-0 top-1/2 z-0 h-1 -translate-y-1/2"
          />

          {/* Sequential carrier → peel → ring ping (hidden when reduced motion) */}
          {!reducedMotion && motionCycleKey > 0 ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-[25] overflow-visible">
              <div className="absolute left-0 right-0 top-1/2 h-0" ref={desktopPathRef}>
                <div
                  key={motionCycleKey}
                  className="approach-carrier-drift-h absolute top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"
                  style={{
                    animationDuration: `${CARRIER_TOTAL_MS}ms`,
                    animationDelay: `${CARRIER_START_DELAY_MS}ms`,
                  }}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
              </div>
              {peelingIdx !== null ? (
                <div
                  className="absolute top-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.92)]"
                  style={{
                    left: `${columnCenterPct(peelingIdx, n)}%`,
                    ...flyingPeelTransition,
                    transform: peelAnimOn
                      ? (steps[peelingIdx]?.position ?? "top") === "top"
                        ? "translate(-50%, calc(-50% - 5rem))"
                        : "translate(-50%, calc(-50% + 5rem))"
                      : "translate(-50%, -50%)",
                  }}
                />
              ) : null}
            </div>
          ) : null}

          <div className="relative z-10 grid" style={gridColsStyle}>
            {steps.map((step, idx) => {
              const isTop = (step.position ?? "top") === "top";
              return (
                <div key={step.key} className="relative flex flex-col items-center">
                  {/* centre dot on the line (static) */}
                  <div
                    ref={setDesktopJunctionRef(idx)}
                    className="absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                  />

                  {/* vertical connector */}
                  <div
                    className={cn(
                      "absolute left-1/2 z-10 w-px -translate-x-1/2 bg-primary",
                      isTop
                        ? "top-[calc(50%-1px)] h-20 -translate-y-full"
                        : "top-[calc(50%+1px)] h-20",
                    )}
                  />

                  {/* ring dot at end of connector */}
                  <div
                    className={cn(
                      "absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-visible rounded-full border-2 border-primary bg-white",
                      isTop
                        ? "top-[calc(50%-5rem)] -translate-y-1/2"
                        : "top-[calc(50%+5rem)] -translate-y-1/2",
                    )}
                  >
                    {!reducedMotion && pingingSteps.includes(idx) ? (
                      <>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/50 [animation-duration:0.95s]"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/35 [animation-delay:220ms] [animation-duration:1.65s]"
                        />
                      </>
                    ) : null}
                    <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* step content */}
                  <div
                    className={cn(
                      "flex flex-col items-center",
                      isTop ? "-translate-y-[8.75rem]" : "translate-y-[8.75rem]",
                    )}
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

      {/* Local styles: looping dashed line + continuous carrier drift */}
      <style jsx>{`
        .approach-carrier-drift-h {
          left: 0%;
          top: 0;
          transform: translate(-50%, -50%);
          animation-name: approachCarrierDriftH;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-iteration-count: 1;
          will-change: left;
        }
        @keyframes approachCarrierDriftH {
          from {
            left: 0%;
            transform: translate(-50%, -50%);
          }
          to {
            left: 100%;
            transform: translate(-50%, -50%);
          }
        }

        .approach-carrier-drift-v {
          left: 50%;
          top: 0%;
          transform: translate(-50%, 0);
          animation-name: approachCarrierDriftV;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-iteration-count: 1;
          will-change: top;
        }
        @keyframes approachCarrierDriftV {
          from {
            top: 0%;
            transform: translate(-50%, 0);
          }
          to {
            top: 100%;
            transform: translate(-50%, -100%);
          }
        }

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
