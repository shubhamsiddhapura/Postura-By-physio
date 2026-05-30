import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { ContactUsSection } from "../../components/Contact/ContactUsSection";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Postura by Physio to book an appointment or ask a question. Get help with pain management, posture correction, rehabilitation, and guided movement programs.",
  alternates: { canonical: `${SITE_URL}/contact-us` },
  openGraph: {
    title: "Contact Postura by Physio",
    description:
      "Book an appointment or ask a question. Get help with pain management, posture correction, rehabilitation, and guided movement programs.",
    url: `${SITE_URL}/contact-us`,
    images: [
      { url: "/contact-hero.png", width: 1200, height: 630, alt: "Contact Postura by Physio" },
    ],
  },
};

const contactSlides = [
  {
    src: "/contact-hero.png",
    mobileSrc: "/contact-hero.png",
    alt: "About Postura by Physio",
    tag: "Contact Us",
    headline:
      "Contact Postura by<br/> Physio",
    body: "Pain should not be part of your daily routine. Our physiotherapy experts are here to help you move better and recover stronger.",
    sub: "",
  },
];

export default function ContactUsPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={contactSlides} id="contact-hero" showBookSessionButton />

      <ContactUsSection />

      <Footer />
    </div>
  );
}

