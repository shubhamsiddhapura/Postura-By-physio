import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import {
  TestimonialsReviewsSection,
  type TestimonialCard,
} from "../../components/Testimonials/TestimonialsReviewsSection";
import {
  HearFromOurClientsSection,
  type ClientMediaItem,
} from "../../components/Testimonials/HearFromOurClientsSection";
import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from patients about their experience with Postura by Physio — recovery, posture, and wellness in Vadodara and online.",
  alternates: { canonical: `${SITE_URL}/testimonials` },
  openGraph: {
    title: "Testimonials",
    description:
      "Hear from patients about their experience with Postura by Physio — recovery, posture, and wellness.",
    url: `${SITE_URL}/testimonials`,
    images: [
      {
        url: "/testimonial-hero.png",
        width: 1200,
        height: 630,
        alt: "Patient testimonials at Postura by Physio",
      },
    ],
  },
};

const testimonialsSlides = [
  {
    src: "/testimonial-hero.png",
    mobileSrc: "/testimonial-hero.png",
    alt: "Patient testimonials at Postura by Physio",
    tag: "Testimonials",
    headline: "What Our Clients Say",
    body: "Recovery takes trust. Read how our patients describe their progress, our approach, and the support they received along the way.",
    sub: "",
  },
];

type TestimonialPageData = {
  cards: TestimonialCard[];
  media: ClientMediaItem[];
};

/**
 * Fetch only published testimonials, sorted the same way the API returns
 * them (order asc, then newest first). The reviews grid uses `cards`;
 * the "Hear From Our Clients" media strip flattens every patient's
 * uploaded photos + videos into a single shuffle-ready list.
 */
async function getTestimonialPageData(): Promise<TestimonialPageData> {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const cards: TestimonialCard[] = rows.map((t) => ({
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: t.age,
    avatar: t.avatar,
    rating: t.rating,
  }));

  const media: ClientMediaItem[] = [];
  for (const t of rows) {
    for (const url of t.photos) {
      media.push({ type: "photo", url, name: t.name });
    }
    for (const url of t.videos) {
      media.push({ type: "video", url, name: t.name });
    }
  }

  return { cards, media };
}

export default async function TestimonialsPage() {
  const { cards, media } = await getTestimonialPageData();

  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={testimonialsSlides} id="testimonials-hero" showBookSessionButton />
      <TestimonialsReviewsSection items={cards} />
      <HearFromOurClientsSection items={media} />
      <Footer
        ctaTitle="Start Your Own Recovery Story"
        ctaDescription="Join our growing community and experience expert physiotherapy care designed to help you move better, feel stronger, and live healthier."
      />
    </div>
  );
}
