import Image from "next/image";

type GalleryTile = { src: string; alt: string };

/** Pilates grid. Expects up to 5 images. */
export function PilatesTherapySection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [a, b, c, d, e] = images;

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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
          <FillTile
            tile={a}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-1 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-3 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 25vw, 45vw"
          />
          <div
            className="hidden min-h-0 md:col-span-5 md:block"
            aria-hidden
          />
          <FillTile
            tile={c}
            className="relative col-span-2 w-full overflow-hidden bg-gray-100 max-md:order-3 max-md:aspect-[16/10] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[18px] max-md:rounded-tr-[48px] max-md:rounded-bl-[48px] max-md:rounded-br-[18px] md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 25vw, 100vw"
          />
          <FillTile
            tile={d}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-4 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-5 md:aspect-auto md:h-[50vh] md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
          />
          <FillTile
            tile={e}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-5 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-4 md:aspect-auto md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
          />
          <FillTile
            tile={b}
            className="relative col-span-1 w-full overflow-hidden bg-gray-100 max-md:order-2 max-md:aspect-[4/5] max-md:min-h-0 max-md:rounded-3xl max-md:rounded-tl-[48px] max-md:rounded-tr-[18px] max-md:rounded-bl-[18px] max-md:rounded-br-[48px] md:col-span-3 md:aspect-auto md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]"
            sizes="(min-width: 768px) 50vw, 45vw"
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
