"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { GalleryCategory } from "@repo/types";
import { GALLERY_CATEGORY_LABELS } from "@repo/types";
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
 * Masonry layout. Expects up to 5 images — extra entries are ignored, missing
 * entries fall back to a soft gray tile so the grid still renders cleanly.
 */
export function GalleryMasonrySection({
  category,
  sectionTitle,
  images,
}: {
  /** The category currently displayed in the grid. */
  category: GalleryCategory;
  /** Text shown in the horizontal divider. */
  sectionTitle: string;
  /** Images for the active category, in display order. */
  images: GalleryTile[];
}) {
  const [a, b, c, d, e] = images;
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);

  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 py-5">
      <div className="mx-auto w-full max-w-[90vw] px-4">
        <div
          ref={dividerInView.ref}
          className="relative my-10 flex items-center justify-center lg:my-12"
          style={{
            opacity: dividerInView.isInView ? 1 : 0,
            transform: dividerInView.isInView
              ? "translate(0,0)"
              : getInitialTransform("up", 22),
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

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
          <Tile
            tile={a}
            className="col-span-2 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gray-100 lg:col-span-3 lg:aspect-auto lg:h-[50vh] lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 1024px) 25vw, 100vw"
            category={category}
            loaded={a?.src ? !!loaded[a.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={140}
          />
          <Tile
            tile={b}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 lg:col-span-5 lg:aspect-auto lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px] rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px]"
            sizes="(min-width: 1024px) 42vw, 45vw"
            category={category}
            loaded={b?.src ? !!loaded[b.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={180}
          />
          <Tile
            tile={c}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 lg:col-span-4 lg:aspect-auto lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 1024px) 34vw, 45vw"
            category={category}
            loaded={c?.src ? !!loaded[c.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={220}
          />
          <Tile
            tile={d}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 lg:col-span-5 lg:aspect-auto lg:h-[50vh] lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px] rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px]"
            sizes="(min-width: 1024px) 42vw, 45vw"
            category={category}
            loaded={d?.src ? !!loaded[d.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={260}
          />
          <Tile
            tile={e}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 lg:col-span-4 lg:aspect-auto lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 1024px) 34vw, 45vw"
            category={category}
            loaded={e?.src ? !!loaded[e.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={300}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Single image tile. Renders a neutral placeholder when the admin hasn't
 * uploaded enough images yet, so the layout never collapses.
 */
function Tile({
  tile,
  className,
  sizes,
  category,
  loaded,
  onLoaded,
  fadeDelayMs,
}: {
  tile: GalleryTile | undefined;
  className: string;
  sizes: string;
  category: GalleryCategory;
  loaded: boolean;
  onLoaded: (src: string) => void;
  fadeDelayMs: number;
}) {
  const tileInView = useInView({ threshold: 0.12 });
  return (
    <div
      ref={tileInView.ref}
      className={`relative ${className}`}
      style={{
        opacity: tileInView.isInView ? 1 : 0,
        transform: tileInView.isInView ? "translate(0,0)" : getInitialTransform("up", 22),
        transition:
          "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${fadeDelayMs}ms`,
      }}
    >
      {tile ? (
        <>
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
        </>
      ) : (
        <div
          aria-label={`Missing ${GALLERY_CATEGORY_LABELS[category]} image`}
          className="h-full w-full bg-gray-100"
        />
      )}
    </div>
  );
}
