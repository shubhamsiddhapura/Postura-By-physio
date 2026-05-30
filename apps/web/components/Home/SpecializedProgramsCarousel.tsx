"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

export type SpecializedProgramSlide = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
};

export type SpecializedProgramsCarouselProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  showSparkle?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  slides?: SpecializedProgramSlide[];
};

const defaultSlides: SpecializedProgramSlide[] = [
  {
    title: "Pre & Post Natal Care",
    subtitle: "Strong recovery. Confident mother.",
    imageSrc: "/wcju-3.jpg",
    href: "/pre-post-natal",
  },
  {
    title: "Corporate / IT Employees",
    subtitle: "Better posture. Better performance.",
    imageSrc: "/wcju-1.jpg",
    href: "/corporate-professionals",
  },
  {
    title: "Middle-Aged Women",
    subtitle: "Life feels better together.",
    imageSrc: "/society-aerobics.jpg",
    href: "/society-exercise",
  },
  {
    title: "Geriatric Rehabilitation",
    subtitle: "Stay steady. Stay independent.",
    imageSrc: "/wcju-4.jpg",
    href: "/geriatric-rehabilitation",
  },
  {
    title: "Physiotherapy Services",
    subtitle: "From pain to progress.",
    imageSrc: "/wcju-5.jpg",
    href: "/physiotherapy-management",
  },
  {
    title: "Prehab for Fitness Lovers",
    subtitle: "Train smart. Prevent injuries.",
    imageSrc: "/wcju-6.jpg",
    href: "/athlete-rehab",
  },
];

/** Horizontal space between mobile carousel cards (px). */
const MOBILE_CAROUSEL_GAP_PX = 12;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getSlotStyle(
  slideIdx: number,
  currentIdx: number,
  total: number,
): CSSProperties {
  const diff = mod(slideIdx - currentIdx, total);

  if (diff === 0) {
    return {
      left: "50%",
      transform: "translate(-50%, -50%) rotateY(0deg) scale(1)",
      zIndex: 30,
      opacity: 1,
    };
  }
  if (diff === total - 1) {
    return {
      left: "18%",
      transform: "translate(-50%, -50%) rotateY(30deg) scale(0.88)",
      zIndex: 15,
      opacity: 1,
    };
  }
  if (diff === 1) {
    return {
      left: "82%",
      transform: "translate(-50%, -50%) rotateY(-30deg) scale(0.88)",
      zIndex: 15,
      opacity: 1,
    };
  }
  const goRight = diff <= Math.floor(total / 2);
  return {
    left: goRight ? "120%" : "-20%",
    transform: `translate(-50%, -50%) rotateY(${goRight ? "-50" : "50"}deg) scale(0.6)`,
    zIndex: 0,
    opacity: 0,
    pointerEvents: "none",
  };
}

function MobileProgramCard({
  slide,
  priority,
}: {
  slide: SpecializedProgramSlide;
  priority?: boolean;
}) {
  return (
    <Link href={slide.href} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl">
        <Image
          src={slide.imageSrc}
          alt={slide.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 340px, 100vw"
          priority={priority}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/35 to-primary/5 h-40" />

        <div
          className="pointer-events-none absolute inset-3 rounded-bl-md rounded-tl-[28px] rounded-br-[28px] rounded-tr-md border border-[#FEF9E0]/90"
          aria-hidden
        />

        <div className="absolute right-3 top-3 z-10">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-white shadow-md">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="text-base font-bold leading-tight">{slide.title}</h3>
          <p className="mt-1.5 text-sm text-white/90">{slide.subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function CarouselCard({
  slide,
  style,
  isCenter,
}: {
  slide: SpecializedProgramSlide;
  style: CSSProperties;
  isCenter: boolean;
}) {
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={cn(
          "transition-[width] duration-700",
          isCenter
            ? "w-[280px] md:w-[380px] lg:w-[460px]"
            : "w-[220px] md:w-[300px] lg:w-[360px]",
        )}
      >
        <Link
          href={slide.href}
          className="group block"
          tabIndex={isCenter ? 0 : -1}
        >
          <div className="relative rounded-bl-xl rounded-tl-[44px] rounded-br-[44px] rounded-tr-xl aspect-[4/3] w-full overflow-hidden ring-1 ring-black/5">
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 280px, 460px"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 via-primary/30 to-primary/5 h-40" />

            {!isCenter ? (
              <div className="absolute inset-0 bg-white/30 transition-opacity duration-700" />
            ) : null}

            <div
              className="pointer-events-none absolute inset-3 rounded-bl-lg rounded-tl-[36px]  rounded-br-[36px]  rounded-tr-lg border border-white/60 md:inset-4"
              aria-hidden
            />

            <div className="absolute right-3 top-3 z-10 md:right-7 md:top-7">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-white shadow-md md:h-10 md:w-10">
                <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2.5} />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
              <h3 className="text-sm font-bold leading-tight md:text-lg">{slide.title}</h3>
              <p className="mt-1 text-[11px] text-white/85 md:text-sm">{slide.subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function SpecializedProgramsCarousel({
  id = "specialized-programs",
  className,
  eyebrow = "Specialized Programs",
  showSparkle = true,
  title = "Specialized Programs for Every Need",
  description = "Targeted solutions designed for specific health conditions and lifestyle requirements.",
  slides = defaultSlides,
}: SpecializedProgramsCarouselProps) {
  const len = slides.length;
  const [index, setIndex] = useState(0);
  /** Skip CSS transition on mobile track when wrapping last↔first (avoids animating through all slides). */
  const [mobileSkipTransition, setMobileSkipTransition] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isTempPaused, setIsTempPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Ellipse indicator constants ───────────────────────────────────────────
  const RX = 240;
  const RY = 18;
  const CX = 250;
  const CY = 24;

  // Angle advances by a full 2π over `len` steps so the dot travels the
  // complete ellipse (bottom arc → right tip → top arc → left tip → repeat).
  //   "next"  → angle decreases (clockwise:  left → bottom → right → top → left)
  //   "prev"  → angle increases (counter-CW: right direction reversed)
  // We accumulate the angle in a ref so rapid clicks stack correctly and the
  // dot never teleports — it always travels through the nearest arc segment.
  const DOT_STEP = (2 * Math.PI) / len;
  const dotAngleRef    = useRef(Math.PI); // accumulated target (starts at left tip)
  const currentAngleRef = useRef(Math.PI); // angle the dot is currently drawn at
  const animFrameRef   = useRef<number | null>(null);

  const [dotPos, setDotPos] = useState({ cx: CX - RX, cy: CY }); // left tip

  // Stable RAF animator — reads from refs so it never needs re-creating.
  const runAnimation = useCallback(() => {
    const toAngle = dotAngleRef.current;
    const fromAngle = currentAngleRef.current;
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    const duration = 700;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const angle = fromAngle + (toAngle - fromAngle) * eased;
      currentAngleRef.current = angle;
      setDotPos({ cx: CX + RX * Math.cos(angle), cy: CY + RY * Math.sin(angle) });
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        currentAngleRef.current = toAngle;
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []); // stable: only touches refs and the constant CX/CY/RX/RY

  const goPrev = useCallback(() => {
    setIndex((i) => {
      const next = mod(i - 1, len);
      if (len > 1 && i === 0 && next === len - 1) setMobileSkipTransition(true);
      return next;
    });
    dotAngleRef.current += DOT_STEP; // counter-clockwise
    runAnimation();
  }, [len, DOT_STEP, runAnimation]);

  const goNext = useCallback(() => {
    setIndex((i) => {
      const next = mod(i + 1, len);
      if (len > 1 && i === len - 1 && next === 0) setMobileSkipTransition(true);
      return next;
    });
    dotAngleRef.current -= DOT_STEP; // clockwise
    runAnimation();
  }, [len, DOT_STEP, runAnimation]);

  const pauseAutoFor = useCallback((ms: number) => {
    setIsTempPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsTempPaused(false), ms);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = () => setPrefersReducedMotion(mq.matches);
    onChange();

    // Safari still uses addListener/removeListener in older versions.
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
    if (len <= 1) return;
    if (prefersReducedMotion) return;
    if (isHovered || isFocusWithin || isTempPaused) return;

    const id = window.setInterval(() => {
      goNext();
    }, 4500);

    return () => window.clearInterval(id);
  }, [goNext, isFocusWithin, isHovered, isTempPaused, len, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!mobileSkipTransition) return;
    const id = requestAnimationFrame(() => setMobileSkipTransition(false));
    return () => cancelAnimationFrame(id);
  }, [mobileSkipTransition, index]);

  const cardStyles = useMemo(
    () => slides.map((_, i) => getSlotStyle(i, index, len)),
    [index, len, slides],
  );

  return (
    <section
      id={id}
      className={cn("bg-white py-5 md:py-10", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={() => setIsFocusWithin(false)}
      onPointerDown={() => pauseAutoFor(8000)}
    >
      <div className="mx-auto max-w-[90vw] md:px-4">
        {/* Header */}
        <div className="grid gap-4 md:grid-cols-[1.1fr,1fr] md:items-end md:gap-10 lg:grid-cols-[1.15fr,0.95fr]">
          <FadeIn direction="up" duration={800} distance={28} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary md:justify-start">
                {showSparkle ? (
                  <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                ) : null}
                <span>{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={28} delay={100} className="md:justify-self-end">
            <div className="text-center text-sm leading-7 text-gray-500 md:text-left md:text-base">
              {description}
            </div>
          </FadeIn>
        </div>

        {/* Mobile: horizontal slide track + centered arrows */}
        <div className="mt-12 md:hidden" aria-live="polite">
          <div className="mx-auto w-full max-w-[min(100%,340px)] overflow-hidden">
            <div
              className={cn(
                "flex",
                !mobileSkipTransition &&
                  "transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              )}
              style={{
                gap: len <= 1 ? undefined : `${MOBILE_CAROUSEL_GAP_PX}px`,
                width:
                  len <= 1
                    ? "100%"
                    : `calc(${len} * 100% + ${(len - 1) * MOBILE_CAROUSEL_GAP_PX}px)`,
                transform:
                  len <= 1
                    ? undefined
                    : `translateX(calc(-${index} * ((100% - ${(len - 1) * MOBILE_CAROUSEL_GAP_PX}px) / ${len} + ${MOBILE_CAROUSEL_GAP_PX}px)))`,
              }}
            >
              {slides.map((slide, i) => (
                <div
                  key={slide.href + slide.title}
                  className="min-w-0 shrink-0 grow-0"
                  style={
                    len <= 1
                      ? { width: "100%" }
                      : {
                          flex: `0 0 calc((100% - ${(len - 1) * MOBILE_CAROUSEL_GAP_PX}px) / ${len})`,
                        }
                  }
                >
                  <MobileProgramCard slide={slide} priority={i === 0} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-10">
            <button
              type="button"
              onClick={() => {
                pauseAutoFor(8000);
                goPrev();
              }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-secondary bg-white text-secondary shadow-sm transition hover:bg-secondary/5"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => {
                pauseAutoFor(8000);
                goNext();
              }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-sm transition hover:brightness-90"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Desktop: 3-up 3D carousel + ellipse indicator */}
        <div
          className="mt-12 hidden overflow-hidden md:mt-16 md:block"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative mx-auto h-[240px] max-w-5xl md:h-[310px] lg:h-[370px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {slides.map((slide, i) => (
              <CarouselCard
                key={i}
                slide={slide}
                style={cardStyles[i]!}
                isCenter={mod(i - index, len) === 0}
              />
            ))}
          </div>
        </div>

        {/* Desktop controls: arrows + 3D ellipse */}
        <div className="mt-10 hidden items-center justify-between gap-4 md:mt-12 md:flex">
          <button
            type="button"
            onClick={() => {
              pauseAutoFor(8000);
              goPrev();
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-secondary text-secondary transition hover:bg-secondary/10 md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <div className="flex min-w-0 flex-1 justify-center px-2">
            <svg
              viewBox="0 0 500 48"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg"
              role="presentation"
              aria-hidden="true"
            >
              <path
                d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY}`}
                fill="none"
                stroke="var(--color-primary, #2A7A7A)"
                strokeWidth={1.3}
                opacity={0.18}
              />
              <ellipse
                cx={CX}
                cy={CY + 2}
                rx={RX - 10}
                ry={RY - 4}
                fill="white"
                opacity={0.5}
              />
              <path
                d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX + RX} ${CY}`}
                fill="none"
                stroke="var(--color-primary, #2A7A7A)"
                strokeWidth={1.5}
                opacity={0.4}
              />
              <circle
                cx={dotPos.cx}
                cy={dotPos.cy}
                r={7.5}
                fill="var(--color-primary, #2A7A7A)"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => {
              pauseAutoFor(8000);
              goNext();
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-sm transition hover:brightness-90 md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </section>
  );
}

export const defaultSpecializedProgramSlides = defaultSlides;
