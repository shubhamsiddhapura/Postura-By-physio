"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useInView } from "../../hooks/useInView";

type GalleryTile = { src: string; alt: string };

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=";

const getInitialTransform = (
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number
): string => {
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

/** Pilates grid. Expects up to 5 images. */
export function PilatesTherapySection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [a, b, c, d, e] = images;
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
          className="relative my-10 flex items-center justify-center md:my-12"
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
          <div className="relative flex items-center gap-2 bg-white px-3 md:px-4">
            <Image
              src="/sparkle.svg"
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-center text-sm font-medium text-primary md:text-[15px]">
              {sectionTitle}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
          <FillTile
            tile={a}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-1 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-3 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 25vw, 45vw"
            loaded={a?.src ? !!loaded[a.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={140}
          />
          <div
            className="hidden min-h-0 md:col-span-5 md:block"
            aria-hidden
          />
          <FillTile
            tile={c}
            className="relative col-span-2 w-full overflow-hidden bg-gray-100 max-md:order-3 max-md:aspect-[16/10] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[18px] max-md:rounded-tr-[48px] max-md:rounded-bl-[48px] max-md:rounded-br-[18px] md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 25vw, 100vw"
            loaded={c?.src ? !!loaded[c.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={180}
          />
          <FillTile
            tile={d}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-4 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-5 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
            loaded={d?.src ? !!loaded[d.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={220}
          />
          <FillTile
            tile={e}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-5 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
            loaded={e?.src ? !!loaded[e.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={260}
          />
          <FillTile
            tile={b}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-2 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-3 md:aspect-auto md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
            loaded={b?.src ? !!loaded[b.src] : true}
            onLoaded={markLoaded}
            fadeDelayMs={300}
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
        transform: tileInView.isInView
          ? "translate(0,0)"
          : getInitialTransform("up", 22),
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
