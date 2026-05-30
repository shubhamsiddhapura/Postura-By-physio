"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";
import { FadeIn } from "../ui/FadeIn";

const galleryImages = [
  {
    src: "/gallery-1.jpg",
    alt: "Physiotherapy treatment on mat",
  },
  {
    src: "/gallery-2.jpg",
    alt: "Group performing mobility exercises",
  },
  {
    src: "/gallery-3.jpg",
    alt: "Pilates equipment training",
  },
  {
    src: "/gallery-4.jpg",
    alt: "Group of women with yoga mats",
  },
];

export function MomentsOfProgress() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // Create truly infinite loop by repeating images many times (like 360 degrees)
  const repeatCount = 90; // Large number for seamless infinite scroll
  const infiniteImages = Array(repeatCount).fill(galleryImages).flat();
  const startIndex = Math.floor(infiniteImages.length / 2); // Start in the middle

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    // Initialize scroll position to middle
    const firstCard = container.children[0] as HTMLElement | undefined;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 24; // gap-6 = 24px
    container.scrollLeft = startIndex * (cardWidth + gap);
  }, []);

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollLeft = container.scrollLeft;
      const firstCard = container.children[0] as HTMLElement | undefined;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      const cardWithGap = cardWidth + gap;
      const containerWidth = container.offsetWidth;

      // Infinite scroll: jump to middle section when near edges
      const middleStart = startIndex * cardWithGap;
      const threshold = cardWithGap * 10; // Jump when within 10 cards of edge

      if (scrollLeft < threshold) {
        // Near start, jump to middle
        isScrollingRef.current = true;
        const currentCardIndex = Math.round(scrollLeft / cardWithGap);
        const offset = currentCardIndex % galleryImages.length;
        container.scrollLeft = middleStart + (offset * cardWithGap);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      } else if (scrollLeft > (infiniteImages.length - 1) * cardWithGap - containerWidth - threshold) {
        // Near end, jump to middle
        isScrollingRef.current = true;
        const currentCardIndex = Math.round(scrollLeft / cardWithGap);
        const offset = currentCardIndex % galleryImages.length;
        container.scrollLeft = middleStart + (offset * cardWithGap);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollBy = (direction: "next" | "prev") => {
    const container = trackRef.current;
    if (!container || isScrollingRef.current) return;

    const firstCard = container.children[0] as HTMLElement | undefined;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const cardWithGap = cardWidth + gap;
    const currentScroll = container.scrollLeft;

    isScrollingRef.current = true;
    container.scrollTo({
      left: currentScroll + (direction === "next" ? cardWithGap : -cardWithGap),
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  const handleNext = () => scrollBy("next");
  const handlePrev = () => scrollBy("prev");

  return (
    <section className="bg-white py-16 md:py-24" id="gallery">
      <div className="md:pl-20 px-4 md:px-0">
        <div className="grid md:gap-10 gap-3 md:grid-cols-[1.2fr,1fr] md:items-end">
          <FadeIn direction="up" duration={800} distance={30} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 text-sm justify-center md:justify-start font-medium text-primary">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span>Moments of Progress</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                Where Recovery Meets
                <br />
                Results
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={30} delay={150}>
            <div className="mx-auto flex max-w-lg flex-col text-center justify-between md:mx-0 md:text-left">
              <p className="text-sm leading-6 text-gray-500 md:text-[13px]">
                See how we bring physiotherapy and fitness together in real-life
                settings — helping people move better, feel stronger, and live
                healthier.
              </p>
              <Link
                href="/gallery"
                prefetch
                className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary underline decoration-primary decoration-2 underline-offset-[10px] transition hover:text-primary/90 md:justify-start"
              >
                View Gallery
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="up" duration={900} distance={40} delay={300}>
        <div className="mt-10 md:mt-20">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {infiniteImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="snap-start flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative h-[260px] w-[calc(100vw-3rem)] md:h-[320px] md:w-[320px] lg:h-[360px] lg:w-[360px] xl:h-[380px] xl:w-[380px] overflow-hidden rounded-bl-lg rounded-tl-[36px] rounded-br-[36px] rounded-tr-lg bg-gray-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 380px, (min-width: 1024px) 360px, (min-width: 768px) 320px, calc(100vw - 2rem)"
                    priority={index === startIndex}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 md:pr-20">
            <button
              type="button"
              onClick={handlePrev}
              className="grid h-10 w-10 place-items-center rounded-full border border-secondary bg-white text-secondary shadow-sm transition hover:bg-[#FFF6ED]"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-white shadow-sm transition hover:opacity-95"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
