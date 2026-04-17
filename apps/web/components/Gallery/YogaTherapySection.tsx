import Image from "next/image";

type GalleryTile = { src: string; alt: string };

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
    "relative w-full overflow-hidden bg-gray-100 max-md:min-h-0 md:min-h-0 md:h-full";

  return (
    <section className="bg-white px-4 pb-5">
      <div className="mx-auto w-full max-w-[min(90vw,1200px)]">
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

        <div className="grid grid-cols-2 gap-3 md:min-h-[min(85vw,640px)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.82fr)_minmax(0,0.82fr)] md:grid-rows-3 md:gap-4 lg:min-h-[680px]">
          <FillTile
            tile={feature}
            className="relative w-full overflow-hidden bg-gray-100 max-md:col-span-2 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-1 md:col-start-1 md:row-span-3 md:row-start-1 md:aspect-auto md:h-full md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 44vw, 100vw"
          />
          <div
            className="hidden min-h-0 md:col-start-2 md:row-start-1 md:block"
            aria-hidden
          />
          <FillTile
            tile={r1r}
            className={`${tile} max-md:aspect-square max-md:rounded-3xl max-md:rounded-tl-[18px] max-md:rounded-tr-[48px] max-md:rounded-bl-[48px] max-md:rounded-br-[18px] md:aspect-auto md:col-start-3 md:row-start-1 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
            sizes="(min-width: 768px) 18vw, 45vw"
          />
          <FillTile
            tile={r2m}
            className={`${tile} max-md:aspect-square max-md:rounded-3xl max-md:rounded-tl-[18px] max-md:rounded-tr-[48px] max-md:rounded-bl-[48px] max-md:rounded-br-[18px] md:aspect-auto md:col-start-2 md:row-start-2 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
            sizes="(min-width: 768px) 18vw, 45vw"
          />
          <FillTile
            tile={r2r}
            className={`${tile} max-md:aspect-square max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:aspect-auto md:col-start-3 md:row-start-2 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
            sizes="(min-width: 768px) 18vw, 45vw"
          />
          <FillTile
            tile={r3m}
            className={`${tile} max-md:aspect-square max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:aspect-auto md:col-start-2 md:row-start-3 md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]`}
            sizes="(min-width: 768px) 18vw, 45vw"
          />
          <FillTile
            tile={r3r}
            className={`${tile} max-md:col-span-2 max-md:aspect-[3/2] max-md:rounded-3xl max-md:rounded-tl-[18px] max-md:rounded-tr-[48px] max-md:rounded-bl-[48px] max-md:rounded-br-[18px] md:col-span-1 md:aspect-auto md:col-start-3 md:row-start-3 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
            sizes="(min-width: 768px) 18vw, 100vw"
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
}: {
  tile: GalleryTile | undefined;
  className: string;
  sizes: string;
}) {
  if (!tile) {
    return (
      <div className={className} aria-hidden>
        <div className="h-full w-full bg-gray-100" />
      </div>
    );
  }
  return (
    <div className={className}>
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    </div>
  );
}
