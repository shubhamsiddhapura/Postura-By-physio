import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { ContactBookingSection } from "../../components/Contact/ContactBookingSection";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book your physiotherapy assessment with Postura by Physio. Doorstep care in Vadodara or online consultations.",
  alternates: { canonical: `${SITE_URL}/book-a-session` },
  openGraph: {
    title: "Book a Session",
    description:
      "Book your physiotherapy assessment with Postura by Physio. Doorstep care or online consultations.",
    url: `${SITE_URL}/book-a-session`,
    images: [
      { url: "/booking-hero.png", width: 1200, height: 630, alt: "Book a session" },
    ],
  },
};

const bookSessionSlides = [
  {
    src: "/booking-hero.png",
    mobileSrc: "/booking-hero.png",
    alt: "Booking Session",
    tag: "Booking Session",
    headline: "Book Your <br/> Session",
    body: "Start your journey towards better movement, pain relief, and overall wellness with our expert-guided physiotherapy and fitness programs.",
    sub: "",
  },
];

export default function BookASessionPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={bookSessionSlides} id="book-a-session-hero" />
      <ContactBookingSection />
      <Footer ctaTitle="Start Your Journey to Better Health Today" ctaDescription="Take the first step towards pain-free movement, improved strength, and long-term wellness with our expert-guided physiotherapy and fitness programs."/>
    </div>
  );
}
