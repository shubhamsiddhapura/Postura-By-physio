import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { ContactBookingSection } from "../../components/Contact/ContactBookingSection";

export const metadata: Metadata = {
  title: "Book a Session | Postura by Physio",
  description:
    "Book your physiotherapy assessment with Postura by Physio. Doorstep care in Vadodara or online consultations.",
};

const bookSessionSlides = [
  {
    src: "/booking-hero.png",
    mobileSrc: "/booking-hero.png",
    alt: "Booking Session",
    tag: "Booking Session",
    headline: "Book Your Session",
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
