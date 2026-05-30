import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { ShareStorySection } from "../../components/ShareStory/ShareStorySection";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Share your recovery story with Postura by Physio. Send a written testimonial, photos, or a short video so we can celebrate your progress and inspire others on their journey.",
  alternates: { canonical: `${SITE_URL}/share-your-story` },
  robots: { index: false, follow: false },
};

const shareStorySlides = [
  {
    src: "/testimonial-hero.png",
    mobileSrc: "/testimonial-hero.png",
    alt: "Share your recovery story with Postura by Physio",
    tag: "Patient Story",
    headline: "Share Your<br/> Recovery Story",
    body: "Your words inspire someone else to take the first step. Tell us about your experience with Postura by Physio in your own voice.",
    sub: "",
  },
];

export default function ShareYourStoryPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={shareStorySlides} id="share-your-story-hero" />
      <ShareStorySection />
      <Footer
        ctaTitle="Ready to Begin Your Own Recovery?"
        ctaDescription="Whether you’ve already healed with us or are just starting out, we’re here for every step of your journey."
      />
    </div>
  );
}
