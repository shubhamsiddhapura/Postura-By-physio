 "use client";

import Image from "next/image";
import { Sparkle, ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

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
  {
    src: "/gallery-1.jpg",
    alt: "Physiotherapy treatment on mat",
  },
  {
    src: "/gallery-2.jpg",
    alt: "Group performing mobility exercises",
  },
];

export function MomentsOfProgress() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (index: number) => {
    const container = trackRef.current;
    if (!container) return;

    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    const targetLeft =
      card.offsetLeft -
      ((card.offsetParent as HTMLElement | null)?.offsetLeft ?? 0);

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(next);
    scrollToIndex(next);
  };

  const handlePrev = () => {
    const prev =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(prev);
    scrollToIndex(prev);
  };

  const progress = ((currentIndex + 1) / galleryImages.length) * 100;

  return (
    <section className="bg-white py-10 md:py-24">
      <div className="md:pl-20 px-4 md:px-0">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-end">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 text-sm justify-center md:justify-start font-medium text-primary">
              <Sparkle className="h-4 w-4" />
              <span>Moments of Progress</span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Where Recovery Meets
              <br />
              Results
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-6 text-gray-500 md:text-[13px] text-center md:text-left">
            See how we bring physiotherapy and fitness together in real-life
            settings — helping people move better, feel stronger, and live
            healthier.
          </p>
        </div>

        <div className="mt-10 md:mt-20">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {galleryImages.map((image, index) => (
              <div
                key={image.src}
                className="snap-start"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative h-[260px] w-[260px] overflow-hidden rounded-bl-lg rounded-tl-[36px] rounded-br-[36px] rounded-tr-lg bg-gray-100 md:h-[320px] md:w-[320px] lg:h-[360px] lg:w-[360px] xl:h-[380px] xl:w-[380px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 380px, (min-width: 1024px) 360px, (min-width: 768px) 320px, 260px"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center md:justify-between justify-center gap-4">
            <div className="w-full">
              <div className="flex items-baseline gap-2 text-sm font-medium text-gray-900">
                <span className="text-lg font-semibold">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-400">
                  /{String(galleryImages.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-3 h-1 md:w-40 rounded-full bg-[#E5F3F3]">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:pr-20">
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
        </div>
      </div>
    </section>
  );
}

