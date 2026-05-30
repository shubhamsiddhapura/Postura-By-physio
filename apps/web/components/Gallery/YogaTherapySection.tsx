"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useInView } from "../../hooks/useInView";

type GalleryTile = { src: string; alt: string };

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=";

const getInitialTransform = (direction: "up" | "down" | "left" | "right" | "none", distance: number): string => {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    default:
      return "none";
  }
};

/**
 * Yoga grid. The left column is a tall feature image and the remaining 5
 * slots fill the 2×3 cluster on the right. Slot order: feature (0), then
 * row1-right (1), row2-middle (2), row2-right (3), row3-middle (4),
 * row3-right (5).
 */
export function YogaTherapySection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [feature, r1r, r2m, r2r, r3m, r3r] = images;
  const tile =
    "relative w-full overflow-hidden bg-gray-100 max-lg:min-h-0 lg:min-h-0 lg:h-full";
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);
  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 pb-5">
      <div className="mx-auto w-full max-w-[90vw] px-4">
        <div
          ref={dividerInView.ref}
          className="relative my-10 flex items-center justify-center lg:my-12"
          style={{
            opacity: dividerInView.isInView ? 1 : 0,
            transform: dividerInView.isInView ? "translate(0,0)" : getInitialTransform("up", 22),
            transition:
              "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: "120ms",
          }}
        >
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
            aria-hidden
          />
          <div className="relative flex items-center gap-2 bg-white px-3 lg:px-4">
            <Image
              src="/sparkle.svg"
              alt="Sparkle icon"
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-center text-sm font-medium text-primary lg:text-[15px]">
              {sectionTitle}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.82fr)_minmax(0,0.82fr)] lg:grid-rows-3 lg:gap-4">
          <FillTile
            tile={feature}
            className="relative w-full overflow-hidden bg-gray-100 max-lg:col-span-2 max-lg:aspect-[4/5] max-lg:min-h-0 max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-span-1 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:aspect-auto lg:h-full lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 44vw, 100vw"
            loaded={feature?.src ? !!loaded[feature.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={140}
          />
          <div
            className="hidden min-h-0 lg:col-start-2 lg:row-start-1 lg:block"
            aria-hidden
          />
          <FillTile
            tile={r1r}
            className={`${tile} max-lg:aspect-square max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:aspect-auto lg:col-start-3 lg:row-start-1 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={r1r?.src ? !!loaded[r1r.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={180}
          />
          <FillTile
            tile={r2m}
            className={`${tile} max-lg:aspect-square max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:aspect-auto lg:col-start-2 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={r2m?.src ? !!loaded[r2m.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={220}
          />
          <FillTile
            tile={r2r}
            className={`${tile} max-lg:aspect-square max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:aspect-auto lg:col-start-3 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={r2r?.src ? !!loaded[r2r.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={260}
          />
          <FillTile
            tile={r3m}
            className={`${tile} max-lg:aspect-square max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:aspect-auto lg:col-start-2 lg:row-start-3 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={r3m?.src ? !!loaded[r3m.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={300}
          />
          <FillTile
            tile={r3r}
            className={`${tile} max-lg:col-span-2 max-lg:aspect-[3/2] max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:col-span-1 lg:aspect-auto lg:col-start-3 lg:row-start-3 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 100vw"
            loaded={r3r?.src ? !!loaded[r3r.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={340}
          />
        </div>
      </div>
    </section>
  );
}

function FillTile({
  tile,
  className,
  sizes,
  loaded,
  onLoaded,
  fadeDelayMs,
}: {
  tile: GalleryTile | undefined;
  className: string;
  sizes: string;
  loaded: boolean;
  onLoaded: (src: string) => void;
  fadeDelayMs: number;
}) {
  if (!tile) {
    return (
      <div className={className} aria-hidden>
        <div className="h-full w-full bg-gray-100" />
      </div>
    );
  }
  const tileInView = useInView({ threshold: 0.12 });
  return (
    <div
      ref={tileInView.ref}
      className={className}
      style={{
        opacity: tileInView.isInView ? 1 : 0,
        transform: tileInView.isInView ? "translate(0,0)" : getInitialTransform("up", 22),
        transition:
          "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${fadeDelayMs}ms`,
      }}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-0 z-[1]",
          "bg-gray-100",
          "transition-opacity duration-500",
          loaded ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-black/5 via-black/0 to-black/10" />
      </div>
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoadingComplete={() => onLoaded(tile.src)}
        className="object-cover"
        sizes={sizes}
      />
    </div>
  );
}
