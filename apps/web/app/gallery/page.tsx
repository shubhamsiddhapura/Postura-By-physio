import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { GalleryMasonrySection } from "../../components/Gallery/GalleryMasonrySection";
import { GallerySplitFeatureSection } from "../../components/Gallery/GallerySplitFeatureSection";
import { YogaTherapySection } from "@/components/Gallery/YogaTherapySection";
import { PilatesTherapySection } from "@/components/Gallery/PilatesTherapySection";
import { CorporateWelnessProgramSection } from "@/components/Gallery/CorporateWelnessProgramSection";
import { prisma } from "@repo/db";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@repo/types";

export const dynamic = "force-dynamic";

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
      <GalleryMasonrySection
        categories={[...GALLERY_CATEGORIES]}
        category="physiotherapy"
        sectionTitle="Physiotherapy Sessions Section"
        images={images.physiotherapy}
      />
      <GallerySplitFeatureSection
        sectionTitle="Aerobics Classes Section"
        images={images.aerobics}
      />
      <YogaTherapySection
        sectionTitle="Yoga Therapy Section"
        images={images.yoga}
      />
      <PilatesTherapySection
        sectionTitle="Pilates Therapy Section"
        images={images.pilates}
      />
      <CorporateWelnessProgramSection
        sectionTitle="Corporate Wellness Program Section"
        images={images.corporate}
      />
      <Footer />
    </div>
  );
}
