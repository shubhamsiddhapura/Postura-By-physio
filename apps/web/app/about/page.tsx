import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import {
  CertificationsSection,
  type CertificationItem,
} from "@/components/About/CertificationsSection";
import { MeetPhysiotherapist } from "../../components/Home/MeetPhysiotherapist";
import { TreatmentPhilosophy } from "@/components/About/TreatmentPhilosophy";
import { VisionMission } from "@/components/About/VisionMission";
import { prisma } from "@repo/db";
import { RecoveryResultsBanner } from "@/components/Home/RecoveryResultsBanner";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Dr. Priyanshi Pandya (MPT, MIAFT) and learn about Postura by Physio—our approach to preventive physiotherapy, prehabilitation, and long-term movement wellness.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Postura by Physio",
    description:
      "Meet Dr. Priyanshi Pandya (MPT, MIAFT) and learn about Postura by Physio—our approach to preventive physiotherapy, prehabilitation, and long-term movement wellness.",
    url: `${SITE_URL}/about`,
    images: [
      {
        url: "/about-hero.png",
        width: 1200,
        height: 630,
        alt: "About Postura by Physio",
      },
    ],
  },
};

const aboutSlides = [
  {
    src: "/about-hero.png",
    mobileSrc: "/about-hero.png",
    alt: "About Postura by Physio",
    tag: "About Postura by Physio",
    headline:
      "Expert Physiotherapy<br/> & Wellness Care at<br/> Postura by Physio",
    body: "Professional physiotherapy and structured fitness programs designed to improve posture, movement, and long-term wellness.",
    sub: "",
  },
];

/**
 * Fetch published certifications directly from the database. The order
 * lives on the row itself (admin sets it via the certifications form)
 * so the marquee renders left-to-right in the same sequence the admin
 * configured.
 */
async function getCertifications(): Promise<CertificationItem[]> {
  const rows = await prisma.certification.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    imageUrl: r.imageUrl,
    title: r.title,
    alt: r.alt,
  }));
}

export default async function AboutPage() {
  const certifications = await getCertifications();

  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={aboutSlides} id="about-hero" showBookSessionButton/>
      <BrandIntroduction />
      <MeetPhysiotherapist eyebrow="Founder Story" heading="The Story Behind Postura by Physio" paragraph1="Postura by Physio was founded by Dr. Priyanshi Pandya(PT) MPT in cardiopulmonary conditions,MIAFT a qualified and NCAHP registered physiotherapist with the vision of shifting healthcare from treating injuries to preventing them early." paragraph2="During her clinical experience, she noticed that many young individuals develop pain and musculoskeletal problems due to poor posture, sedentary lifestyles, and lack of movement awareness. Most patients seek physiotherapy only when the pain becomes severe." paragraph3="This observation led her to promote the concept of prehabilitation, focusing on strengthening and conditioning the body before injuries occur. Through personalized care and preventive fitness programs, her mission is to build stronger, healthier, and injury-free communities." ctaLabel="Start Your Recovery Journey" whatsappPhone="916354011290" whatsappMessage="Hi! I’d like to start my recovery journey and book a session." />
      <CertificationsSection items={certifications} />
      <TreatmentPhilosophy />
      <VisionMission />
      <RecoveryResultsBanner />
      <Footer />
    </div>
  );
}

