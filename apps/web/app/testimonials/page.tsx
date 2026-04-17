import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import {
  TestimonialsReviewsSection,
  type TestimonialCard,
} from "../../components/Testimonials/TestimonialsReviewsSection";
import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials | Postura by Physio",
  description:
    "Hear from patients about their experience with Postura by Physio — recovery, posture, and wellness in Vadodara and online.",
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

/**
 * Fetch only published testimonials, sorted the same way the API returns
 * them (order asc, then newest first). The section component handles the
 * "View More" progressive reveal on the client.
 */
async function getTestimonialCards(): Promise<TestimonialCard[]> {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((t) => ({
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: t.age,
    avatar: t.avatar,
  }));
}

export default async function TestimonialsPage() {
  const items = await getTestimonialCards();

  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={testimonialsSlides} id="testimonials-hero" showBookSessionButton />
      <TestimonialsReviewsSection items={items} />
      <Footer
        ctaTitle="Start Your Own Recovery Story"
        ctaDescription="Join our growing community and experience expert physiotherapy care designed to help you move better, feel stronger, and live healthier."
      />
    </div>
  );
}
