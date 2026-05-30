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
 * Split-feature grid used for the Aerobics category. Expects up to 6 images
 * mapped to the following slots (in order):
 *   0: col1 row1   1: col2 row1   2: col1 row2
 *   3: col1 row3   4: col2 row3   5: col3 feature (right-hand tall)
 */
export function GallerySplitFeatureSection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [col1Row1, col2Row1, col1Row2, col1Row3, col2Row3, col3Feature] =
    images;
  const tile =
    "relative w-full overflow-hidden bg-gray-100 max-lg:min-h-0 lg:min-h-0 lg:h-full";
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);
  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 pb-5 lg:pt-0">
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

        <div className="grid grid-cols-2 gap-3 lg:min-h-[680px] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.5fr)] lg:grid-rows-3 lg:gap-4">
          <FillTile
            tile={col1Row1}
            className={`${tile} max-lg:order-1 max-lg:aspect-square rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] lg:order-none lg:aspect-auto lg:col-start-1 lg:row-start-1 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={col1Row1?.src ? !!loaded[col1Row1.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={140}
          />
          <FillTile
            tile={col2Row1}
            className={`${tile} max-lg:order-2 max-lg:aspect-square rounded-tr-[48px] rounded-tl-[18px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:aspect-auto lg:col-start-2 lg:row-start-1 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={col2Row1?.src ? !!loaded[col2Row1.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={180}
          />
          <FillTile
            tile={col1Row2}
            className={`${tile} max-lg:order-3 max-lg:aspect-square rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:aspect-auto lg:col-start-1 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={col1Row2?.src ? !!loaded[col1Row2.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={220}
          />
          <div
            className="hidden min-h-0 lg:col-start-2 lg:row-start-2 lg:block"
            aria-hidden
          />
          <FillTile
            tile={col1Row3}
            className={`${tile} max-lg:order-5 max-lg:col-span-2 max-lg:aspect-[16/10] rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:col-span-1 lg:aspect-auto lg:col-start-1 lg:row-start-3 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]`}
            sizes="(min-width: 1024px) 18vw, 100vw"
            loaded={col1Row3?.src ? !!loaded[col1Row3.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={260}
          />
          <FillTile
            tile={col2Row3}
            className={`${tile} max-lg:order-4 max-lg:aspect-square rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] lg:order-none lg:aspect-auto lg:col-start-2 lg:row-start-3 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]`}
            sizes="(min-width: 1024px) 18vw, 45vw"
            loaded={col2Row3?.src ? !!loaded[col2Row3.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={300}
          />
          <FillTile
            tile={col3Feature}
            className={`relative w-full overflow-hidden bg-gray-100 max-lg:order-6 max-lg:col-span-2 max-lg:aspect-[4/5] max-lg:min-h-0 rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] lg:order-none lg:col-span-1 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:aspect-auto lg:h-full lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]`}
            sizes="(min-width: 1024px) 44vw, 100vw"
            loaded={col3Feature?.src ? !!loaded[col3Feature.src] : true}
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
