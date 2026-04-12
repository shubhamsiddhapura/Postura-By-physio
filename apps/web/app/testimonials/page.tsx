import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { TestimonialsReviewsSection } from "../../components/Testimonials/TestimonialsReviewsSection";

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

export default function TestimonialsPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={testimonialsSlides} id="testimonials-hero" showBookSessionButton />
      <TestimonialsReviewsSection />
      <Footer
        ctaTitle="Start Your Own Recovery Story"
        ctaDescription="Join our growing community and experience expert physiotherapy care designed to help you move better, feel stronger, and live healthier."
      />
    </div>
  );
}
