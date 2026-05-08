"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, type MouseEvent } from "react";
import { FadeIn } from "../ui/FadeIn";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

type HeroSlide = {
  /** Desktop background image */
  src: string;
  /** Mobile background image */
  mobileSrc: string;
  /** Accessible alt text for the background image */
  alt: string;
  /** Small label/tag above the heading */
  tag: string;
  /** Main heading (supports simple HTML like <br/>) */
  headline: string;
  /** Supporting body copy */
  body: string;
  /** Optional sub-text */
  sub?: string;
};

type HeroSectionProps = {
  /** Slides to render in the hero. If omitted, the component will either use the single background props or fall back to default home slides. */
  slides?: HeroSlide[];
  /** Optional custom section id for in-page navigation */
  id?: string;
  /** Optional extra className for the outer section */
  className?: string;
  /** Tailwind height class for the hero (e.g. "h-screen", "h-[70vh]"). Defaults to "h-screen". */
  heightClassName?: string;
  /** Desktop background image for a single, non-slideshow hero */
  bgImageDesktop?: string;
  /** Mobile background image for a single, non-slideshow hero */
  bgImageMobile?: string;
  /** Alt text for the single background image */
  alt?: string;
  /** Tag for the single background hero */
  tag?: string;
  /** Headline for the single background hero (supports simple HTML like <br/>) */
  headline?: string;
  /** Body for the single background hero */
  body?: string;
  /** Optional sub-text for the single background hero */
  sub?: string;
  /** When true, shows a “Book Session” CTA in the hero (WhatsApp). Hidden by default. */
  showBookSessionButton?: boolean;
  /** Controls where the Book Session button appears when enabled. */
  bookSessionButtonPlacement?: "below" | "right";
  /**
   * When set (e.g. patient-interaction flow), the Book Session CTA opens this handler instead of linking to WhatsApp.
   */
  bookSessionOnClick?: () => void;
};

const defaultSlides: HeroSlide[] = [
  {
    src: "/hero-1.png",
    mobileSrc: "/responsive-banner-1.png",
    alt: "Wrong Posture",
    tag: "Correct Your Posture with Postura by Physio",
    headline: "A Wrong Posture and Stiff Muscles Can Lead to Big Problems",
    body: "Small daily habits create long-term consequences. Poor posture and tight muscles silently reduce productivity, increase fatigue, and cause chronic pain.",
    sub: "Start correcting today for a stronger tomorrow.",
  },
  {
    src: "/hero-2.png",
    mobileSrc: "/responsive-banner-2.png",
    alt: "Doorstep Care",
    tag: "Convenience Meets Care",
    headline: "Professional Care.<br/> Right at Your </br> Doorstep.",
    body: "No travel. No waiting rooms.",
    sub: "We bring expert physiotherapy sessions to your home, society, or even online so your recovery fits into your life.",
  },
  {
    src: "/hero-3.png",
    mobileSrc: "/responsive-banner-3.png",
    alt: "Total Mobility",
    tag: "Fitness | Rehab | Prevention",
    headline: "Every Muscle & Joint <br/> Matters. Complete <br/> Body Care.",
    body: "Professional physiotherapy and structured fitness programs designed to improve posture, movement, and long-term wellness.",
    sub: "",
  },
];

const AUTOPLAY_INTERVAL = 4000;

export function HeroSection({
  slides,
  id = "hero",
  className = "",
  heightClassName = "h-screen",
  bgImageDesktop,
  bgImageMobile,
  alt,
  tag,
  headline,
  body,
  sub,
  showBookSessionButton = false,
  bookSessionButtonPlacement = "below",
  bookSessionOnClick,
}: HeroSectionProps) {
  const bookHref = bookSessionOnClick ? "#" : "https://wa.me/916354011290";
  const bookClick = bookSessionOnClick
    ? (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        bookSessionOnClick();
      }
    : undefined;
  const resolvedSlides: HeroSlide[] =
    slides && slides.length > 0
      ? slides
      : bgImageDesktop || bgImageMobile || headline || body
        ? [
          {
            src: bgImageDesktop || "/hero-1.png",
            mobileSrc: bgImageMobile || bgImageDesktop || "/responsive-banner-1.png",
            alt: alt || "Hero background",
            tag: tag || "",
            headline:
              headline ||
              "A Wrong Posture and Stiff Muscles Can Lead to Big Problems",
            body:
              body ||
              "Small daily habits create long-term consequences. Poor posture and tight muscles silently reduce productivity, increase fatigue, and cause chronic pain.",
            sub: sub,
          },
        ]
        : defaultSlides;

  const [current, setCurrent] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % resolvedSlides.length);
  }, [resolvedSlides.length]);

  const goTo = (index: number) => setCurrent(index);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return; // no need to autoplay single-slide heroes

    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next, resolvedSlides.length]);

  return (
    <section
      id={id}
      className={`relative w-full bg-primary ${heightClassName} overflow-hidden rounded-br-[140px] ${className}`}
    >
      {/* Slides */}
      {resolvedSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Skeleton / shimmer overlay (fades out when image loads) */}
          <div
            aria-hidden="true"
            className={[
              "absolute inset-0 z-[1]",
              "bg-primary",
              "transition-opacity duration-500",
              loadedSlides[index] ? "opacity-0 pointer-events-none" : "opacity-100",
            ].join(" ")}
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/5 via-white/0 to-white/10" />
          </div>

          {/* Mobile background image (below md) */}
          <Image
            src={slide.mobileSrc}
            alt={slide.alt}
            fill
            priority={index === 0 || index === 1}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
            {...(index === 0 ? { loading: "eager" as const } : {})}
            onLoadingComplete={() =>
              setLoadedSlides((prev) => (prev[index] ? prev : { ...prev, [index]: true }))
            }
            className="object-cover object-top md:hidden"
            sizes="100vw"
          />

          {/* Desktop background image (md and above) */}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0 || index === 1}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
            {...(index === 0 ? { loading: "eager" as const } : {})}
            onLoadingComplete={() =>
              setLoadedSlides((prev) => (prev[index] ? prev : { ...prev, [index]: true }))
            }
            className="object-cover object-center hidden md:block"
            sizes="100vw"
          />

          {showBookSessionButton && bookSessionButtonPlacement === "right" && (
            <div className="hidden md:block absolute md:bottom-auto md:left-auto md:top-1/2 md:right-28">
              <PrimaryCTAButton
                href={bookHref}
                label="Book Session"
                size="sm"
                className="md:mt-2"
                onClick={bookClick}
              />
            </div>
          )}

          {/* Text Content */}
          <div className="absolute bottom-40 left-0 right-0 md:bottom-auto md:top-32 lg:top-40 flex flex-col px-6 md:px-10 lg:px-24 md:max-w-xl lg:max-w-3xl">
            {/* Tag */}
            <FadeIn direction="up" distance={30} duration={800} delay={0}>
              <p className="flex items-center gap-2 text-sm font-medium text-[#FEF9E0] mb-4 md:mb-5 justify-center md:justify-start">
                <span>✦</span>
                {slide.tag}
              </p>
            </FadeIn>

            {/* Headline */}
            <FadeIn direction="up" distance={30} duration={800} delay={150}>
              <div
                className={[
                  "flex flex-col items-center gap-4",
                  "md:flex-row md:items-start md:justify-between md:gap-8",
                ].join(" ")}
              >
                <h1
                  className={[
                    "text-4xl md:text-5xl lg:text-6xl font-bold text-[#FEF9E0] leading-tight text-center md:text-left",
                    bookSessionButtonPlacement === "below" ? "mb-4 md:mb-5" : "",
                  ].join(" ")}
                  dangerouslySetInnerHTML={{ __html: slide.headline }}
                />
              </div>
            </FadeIn>

            {/* Body */}
            <FadeIn direction="up" distance={30} duration={800} delay={300}>
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-2 md:mb-3 text-center md:text-left">
                {slide.body}
              </p>
            </FadeIn>

            {/* Sub */}
            {slide.sub && (
              <FadeIn direction="up" distance={30} duration={800} delay={450}>
                <p className="text-sm md:text-base text-white/90 leading-relaxed text-center md:text-left">
                  {slide.sub}
                </p>
              </FadeIn>
            )}

            {showBookSessionButton && bookSessionButtonPlacement === "right" && (
              <FadeIn
                direction="up"
                duration={800}
                distance={28}
                delay={300}
                className="flex md:hidden justify-center"
              >
                <PrimaryCTAButton
                  href={bookHref}
                  label="Book Session"
                  size="sm"
                  className="mt-10"
                  onClick={bookClick}
                />
              </FadeIn>
            )}

            {showBookSessionButton && bookSessionButtonPlacement === "below" && (
              <FadeIn
                direction="up"
                duration={800}
                distance={28}
                delay={300}
                className="flex justify-center md:justify-start"
              >
                <PrimaryCTAButton
                  href={bookHref}
                  label="Book Session"
                  size="sm"
                  className="mt-10"
                  onClick={bookClick}
                />
              </FadeIn>
            )}
          </div>
        </div>
      ))}

      {/* Dot indicators (only for real slideshows) */}
      {resolvedSlides.length > 1 && (
        <FadeIn
          direction="up"
          distance={20}
          duration={800}
          delay={600}
          className="absolute bottom-8 left-36 md:left-16 lg:left-24 z-20"
        >
          <div className="flex items-center bg-white/30 backdrop-blur-md rounded-full px-3 py-2 gap-3">
            {resolvedSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={[
                  "rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF9E0]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20",
                  index === current
                    ? "w-8 h-4 border-2 border-[#FEF9E0] bg-transparent flex items-center justify-center"
                    : "w-2 h-2 bg-[#FEF9E0]/55 hover:bg-[#FEF9E0]/85",
                ].join(" ")}
              >
                {index === current && (
                  <span className="block w-5 h-2 rounded-full bg-[#FEF9E0]" />
                )}
              </button>
            ))}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
