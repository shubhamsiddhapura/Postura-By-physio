import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Corporate Professionals",
  description:
    "Corporate wellness and physiotherapy programs for IT and desk-based professionals to reduce pain, improve posture, and stay active through guided movement and preventive care.",
  alternates: { canonical: `${SITE_URL}/corporate-professionals` },
  openGraph: {
    title: "Corporate Wellness & Physiotherapy Programs",
    description:
      "Designed for desk-based professionals to reduce pain, improve posture, and boost daily productivity through guided movement and preventive care.",
    url: `${SITE_URL}/corporate-professionals`,
    images: [
      {
        url: "/corporate-hero.png",
        width: 1200,
        height: 630,
        alt: "Corporate Wellness & Physiotherapy Programs",
      },
    ],
  },
};

const aboutSlides = [
    {
        src: "/corporate-hero.png",
        mobileSrc: "/corporate-hero.png",
        alt: "IT / Corporate Professionals",
        tag: "IT / Corporate Professionals",
        headline:
            "Corporate Wellness & Physiotherapy<br/> Programs",
        body: "Designed for IT and desk-based professionals, our structured fitness and physiotherapy programs help reduce pain, improve posture, and boost daily productivity through guided movement and preventive care.",
        sub: "",
    },
];

export default function CorporateProfessionalsPage() {
    return (
        <div className="md:overflow-x-visible">
            <HeroSection slides={aboutSlides} showBookSessionButton id="corporate-professionals-hero" />
            <BrandIntroduction
                eyebrow="Introduction"
                title="Corporate Wellness for Better Productivity"
                description="In today’s digital work environment, long sitting hours, repetitive tasks, and high stress levels can lead to posture-related pain, fatigue, and reduced work performance."
                paragraph1="At Postura by Physio, we provide specialized corporate fitness and rehabilitation programs tailored for IT professionals and desk-job employees. Our scientifically structured sessions combine aerobics, yoga, Pilates, and physiotherapy to help you stay active, pain-free, and productive throughout your workday."
                highlight=""
                image1={{ src: "/cp-1.jpg", alt: "Physiotherapy session" }}
                image2={{ src: "/cp-2.jpg", alt: "Posture correction session" }}
            />
            <CommonChallenges
                bullets={[
                    "Prolonged sitting leading to neck, shoulder, and lower back pain",
                    "Poor posture causing muscle imbalance and stiffness",
                    "Reduced physical activity leading to low stamina and weight gain",
                    "Workplace stress affecting mental and physical well-being",
                    "Repetitive strain injuries from continuous typing or screen use",
                ]}
            />
            <StructuredFitnessSolutions />
            <KeyBenefits flipImageX={true} />
            <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Ready to Build a Healthier and More <br/> Productive Work Routine?" ctaDescription="Join our Corporate Fitness & Physiotherapy Programs and experience structured wellness support designed<br/> for modern professionals." />
        </div>
    );
}

