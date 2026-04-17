import Image from "next/image";
import type { GalleryCategory } from "@repo/types";
import { GALLERY_CATEGORY_LABELS } from "@repo/types";

type GalleryTile = { src: string; alt: string };

/**
 * Masonry layout. Expects up to 5 images — extra entries are ignored, missing
 * entries fall back to a soft gray tile so the grid still renders cleanly.
 */
export function GalleryMasonrySection({
  categories,
  category,
  sectionTitle,
  images,
}: {
  /** All category ids to render as pills above the grid. */
  categories: GalleryCategory[];
  /** The category currently displayed in the grid. */
  category: GalleryCategory;
  /** Text shown in the horizontal divider. */
  sectionTitle: string;
  /** Images for the active category, in display order. */
  images: GalleryTile[];
}) {
  const [a, b, c, d, e] = images;

  return (
    <section className="bg-white px-4 py-5">
      <div className="mx-auto w-full max-w-[min(90vw,1200px)]">
        <div
          className="flex flex-wrap mt-10 items-center justify-center gap-3 md:gap-4"
          aria-label="Service categories"
        >
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary md:px-5 md:py-2.5"
            >
              {GALLERY_CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        <div className="relative my-10 flex items-center justify-center md:my-12">
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
          <Tile
            tile={a}
            className="col-span-2 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gray-100 md:col-span-3 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 768px) 25vw, 100vw"
            category={category}
          />
          <Tile
            tile={b}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 md:col-span-5 md:aspect-auto md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px] rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px]"
            sizes="(min-width: 768px) 42vw, 45vw"
            category={category}
          />
          <Tile
            tile={c}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 768px) 34vw, 45vw"
            category={category}
          />
          <Tile
            tile={d}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 md:col-span-5 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px] rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px]"
            sizes="(min-width: 768px) 42vw, 45vw"
            category={category}
          />
          <Tile
            tile={e}
            className="col-span-1 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px] rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px]"
            sizes="(min-width: 768px) 34vw, 45vw"
            category={category}
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
}: {
  tile: GalleryTile | undefined;
  className: string;
  sizes: string;
  category: GalleryCategory;
}) {
  return (
    <div className={`relative ${className}`}>
      {tile ? (
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div
          aria-label={`Missing ${GALLERY_CATEGORY_LABELS[category]} image`}
          className="h-full w-full bg-gray-100"
        />
      )}
    </div>
  );
}
