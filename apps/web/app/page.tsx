import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { HeroSection } from "../components/Home/HeroSection";
import { WhoCanJoin } from "../components/Home/WhoCanJoin";
import { MovementCare } from "../components/Home/MovementCare";
import { WhyChooseUs } from "../components/Home/WhyChooseUs";
import { MeetPhysiotherapist } from "../components/Home/MeetPhysiotherapist";
import { ServicesSection } from "../components/Home/ServicesSection";
import { MomentsOfProgress } from "../components/Home/MomentsOfProgress";
import { FaqSection } from "../components/Home/FaqSection";
import { RecoveryResultsBanner } from "../components/Home/RecoveryResultsBanner";
import { AskPhysioSection } from "../components/Home/AskPhysioSection";
import { Footer } from "../components/Home/Footer";

const SITE_URL = "https://www.posturabyphysio.com";
const SITE_NAME = "Postura by Physio";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/admin-logo.png`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export const metadata: Metadata = {
  title: "Physiotherapy & Movement Programs",
  description:
    "Personalized physiotherapy and structured movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Rehab, posture correction, pain management, and guided fitness.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Physiotherapy & Movement Programs",
    description:
      "Personalized physiotherapy and structured movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Rehab, posture correction, pain management, and guided fitness.",
    url: SITE_URL,
    images: [{ url: "/about-hero.png", width: 1200, height: 630, alt: "Postura by Physio" }],
  },
};

export default function HomePage() {
  return (
    <div id="home" className="md:overflow-x-visible">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <HeroSection />
      <WhoCanJoin />
      <MovementCare />
      <WhyChooseUs />
      <MeetPhysiotherapist />
      <ServicesSection />
      <MomentsOfProgress />
      <FaqSection />
      <RecoveryResultsBanner />
      <AskPhysioSection />
      <Footer />
    </div>
  );
}
