import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { GalleryCategoryBrowser } from "@/components/Gallery/GalleryCategoryBrowser";
import { prisma } from "@repo/db";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@repo/types";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore real moments of recovery, strength building, and wellness transformation through our guided physiotherapy and fitness sessions.",
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Gallery",
    description:
      "Explore real moments of recovery, strength building, and wellness transformation through our guided physiotherapy and fitness sessions.",
    url: `${SITE_URL}/gallery`,
    images: [
      { url: "/gallery-hero.png", width: 1200, height: 630, alt: "Postura Gallery" },
    ],
  },
};

const gallerySlides = [
  {
    src: "/gallery-hero.png",
    mobileSrc: "/gallery-hero.png",
    alt: "Postura Gallery",
    tag: "Postura Gallery",
    headline: "Our Therapy & Fitness<br/> Journey in Action",
    body: "Explore real moments of recovery, strength building, and wellness transformation through our guided physiotherapy and fitness sessions.",
    sub: "",
  },
];

type CategoryTile = { src: string; alt: string };

/**
 * Fetch all gallery images in a single round-trip, then group by category so
 * each section receives only the tiles it needs (in order).
 */
async function getImagesByCategory(): Promise<
  Record<GalleryCategory, CategoryTile[]>
> {
  const rows = await prisma.galleryImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });

  const byCat: Record<GalleryCategory, CategoryTile[]> = {
    physiotherapy: [],
    aerobics: [],
    yoga: [],
    pilates: [],
    corporate: [],
  };
  for (const r of rows) {
    const category = r.category as GalleryCategory | null | undefined;
    if (!category || !GALLERY_CATEGORIES.includes(category)) continue;

    const anyR = r as unknown as { alt?: unknown; caption?: unknown };
    const alt =
      (typeof anyR.alt === "string" && anyR.alt.trim()) ||
      (typeof anyR.caption === "string" && anyR.caption.trim()) ||
      "Gallery image";

    byCat[category].push({
      src: r.url,
      alt,
    });
  }
  return byCat;
}

export default async function GalleryPage() {
  const images = await getImagesByCategory();

  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={gallerySlides} id="gallery-hero" showBookSessionButton />
      <GalleryCategoryBrowser imagesByCategory={images} />
    </div>
  );
}
