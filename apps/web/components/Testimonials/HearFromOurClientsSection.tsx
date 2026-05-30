"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

/**
 * One photo or video coming from a published testimonial. `name` is
 * shown in the lightbox caption so visitors know whose story they're
 * looking at.
 */
export type ClientMediaItem = {
  type: "photo" | "video";
  url: string;
  name: string;
};

type LaneDirection = "left" | "right";

/**
 * "Hear From Our Clients" — a two-lane media strip that renders below
 * the testimonial reviews. Each lane scrolls in opposite directions
 * and pauses when hovered; clicking a tile opens it in a fullscreen
 * lightbox so visitors can watch the full clip or see the full photo.
 *
 * The marquee CSS lives in `globals.css` (`.marquee-track`,
 * `.marquee-track-reverse`, `.marquee-lane:hover .marquee-track`).
 *
 * Returns `null` when no testimonial has any photos or videos so the
 * section gracefully disappears on a fresh install.
 */
export function HearFromOurClientsSection({
  items,
}: {
  items: ClientMediaItem[];
}) {
  const [active, setActive] = useState<ClientMediaItem | null>(null);

  const { topRow, bottomRow } = useMemo(() => splitIntoRows(items), [items]);

  if (items.length === 0) return null;

  return (
    <section
      id="hear-from-our-clients"
      className="overflow-hidden bg-white py-16 md:py-20"
    >
      <FadeIn direction="up" duration={800} distance={26}>
        <div className="mx-auto max-w-[90vw] text-center md:px-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Hear From Our Clients
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            Real moments from real recoveries — captured by patients
            during their journey with Postura by Physio.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 space-y-5 md:mt-14 md:space-y-6">
        <Lane
          items={topRow}
          direction="left"
          onSelect={setActive}
          duration="32s"
        />
        <Lane
          items={bottomRow}
          direction="right"
          onSelect={setActive}
          duration="38s"
        />
      </div>

      <MediaLightbox media={active} onClose={() => setActive(null)} />
    </section>
  );
}

// ---------- Lane (single marquee row) ----------

function Lane({
  items,
  direction,
  duration,
  onSelect,
}: {
  items: ClientMediaItem[];
  direction: LaneDirection;
  /** CSS animation duration string, e.g. "55s". */
  duration: string;
  onSelect: (item: ClientMediaItem) => void;
}) {
  if (items.length === 0) return null;

  // Render the list twice so the -50% translate loops seamlessly. Use
  // a stable `key` prefix per copy so React doesn't reuse DOM nodes
  // across copies (which would cause flicker mid-loop).
  return (
    <div
      className="marquee-lane group/lane relative overflow-hidden"
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      <div
        className={cn(
          "marquee-track flex items-stretch gap-4 md:gap-5",
          direction === "right" && "marquee-track-reverse"
        )}
      >
        {[0, 1].map((copyIdx) => (
          <div
            key={copyIdx}
            className="flex shrink-0 items-stretch gap-4 md:gap-5"
            aria-hidden={copyIdx === 1 ? true : undefined}
          >
            {items.map((item, idx) => (
              <MediaCard
                key={`${copyIdx}-${idx}-${item.url}`}
                item={item}
                width={pickWidth(idx)}
                onClick={() => onSelect(item)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Soft fade masks at the edges so cards seem to drift in/out of
          the strip rather than pop. Pure decorative — `pointer-events-none`
          keeps them out of click handling. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent md:w-24" />
    </div>
  );
}

// ---------- Single card (photo or video thumbnail) ----------

function MediaCard({
  item,
  width,
  onClick,
}: {
  item: ClientMediaItem;
  /** Tailwind-friendly width class, e.g. "w-[260px]". */
  width: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        item.type === "video"
          ? `Play ${item.name}'s video story`
          : `View ${item.name}'s photo`
      }
      className={cn(
        "group relative aspect-[16/10] shrink-0 overflow-hidden bg-gray-100 ring-1 ring-black/5 transition",
        "rounded-tl-[28px] rounded-br-[28px] rounded-tr-[10px] rounded-bl-[10px]",
        "hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        width
      )}
    >
      {item.type === "photo" ? (
        <Image
          src={item.url}
          alt={`${item.name}'s recovery photo`}
          fill
          sizes="(min-width: 768px) 320px, 75vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
      ) : (
        <>
          <video
            src={item.url}
            preload="metadata"
            muted
            playsInline
            // Loading the first frame as a poster-equivalent. We do NOT
            // autoplay here — the lightbox handles full playback.
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          {/* Subtle dark wash so the play button reads cleanly even on
              videos with bright first frames. */}
          <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />
          <span className="absolute inset-0 grid place-items-center">
            <span
              aria-hidden
              className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-white shadow-lg ring-4 ring-white/30 transition group-hover:scale-110 md:h-14 md:w-14"
            >
              <Play className="ml-0.5 h-5 w-5 fill-current md:h-6 md:w-6" />
            </span>
          </span>
        </>
      )}
    </button>
  );
}

// ---------- Lightbox ----------

function MediaLightbox({
  media,
  onClose,
}: {
  media: ClientMediaItem | null;
  onClose: () => void;
}) {
  // Lock body scroll while open and close on Escape — standard modal UX.
  useEffect(() => {
    if (!media) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${media.name}'s ${media.type === "video" ? "video" : "photo"}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative flex max-h-full w-full max-w-4xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === "video" ? (
          <video
            src={media.url}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] w-full rounded-2xl bg-black object-contain"
          />
        ) : (
          <div className="relative h-[80vh] w-full max-w-full">
            <Image
              src={media.url}
              alt={`${media.name}'s recovery photo`}
              fill
              sizes="(min-width: 1024px) 896px, 92vw"
              className="rounded-2xl object-contain"
              unoptimized
            />
          </div>
        )}
        {media.name ? (
          <p className="mt-4 text-sm font-medium text-white/85">
            {media.name}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ---------- Helpers ----------

/**
 * Split the media list across two rows. The split favours interleaving
 * (even indexes top, odd indexes bottom) so a sequence of all-photos
 * followed by all-videos doesn't end up segregated lane-by-lane.
 *
 * When there are very few items we mirror the same items in the other
 * row so the strip still feels populated. The reverse direction +
 * different speed already hide the duplication visually.
 */
function splitIntoRows(items: ClientMediaItem[]): {
  topRow: ClientMediaItem[];
  bottomRow: ClientMediaItem[];
} {
  const topRow: ClientMediaItem[] = [];
  const bottomRow: ClientMediaItem[] = [];
  items.forEach((item, idx) => {
    if (idx % 2 === 0) topRow.push(item);
    else bottomRow.push(item);
  });

  if (topRow.length === 0) return { topRow: bottomRow, bottomRow };
  if (bottomRow.length === 0) return { topRow, bottomRow: topRow };
  return { topRow, bottomRow };
}

/**
 * Cycle a few preset card widths so the strip has the organic
 * varied-width look from the design instead of a uniform grid.
 */
function pickWidth(index: number): string {
  const widths = [
    "w-[240px] md:w-[320px]",
    "w-[280px] md:w-[380px]",
    "w-[260px] md:w-[350px]",
    "w-[300px] md:w-[420px]",
  ];
  return widths[index % widths.length]!;
}
