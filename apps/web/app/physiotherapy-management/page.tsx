import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Physiotherapy Management",
  description:
    "Structured physiotherapy management focused on pain relief, mobility restoration, and strength rebuilding through progressive, evidence-based rehabilitation plans.",
  alternates: { canonical: `${SITE_URL}/physiotherapy-management` },
  openGraph: {
    title: "Physiotherapy Management",
    description:
      "Pain relief, mobility restoration, and strength rebuilding through progressive physiotherapy management plans designed for long-term recovery.",
    url: `${SITE_URL}/physiotherapy-management`,
    images: [
      {
        url: "/physio-hero.png",
        width: 1200,
        height: 630,
        alt: "Physiotherapy Management",
      },
    ],
  },
};

const physiotherapySlides = [
  {
    src: "/physio-hero.png",
    mobileSrc: "/physio-hero.png",
    alt: "Physiotherapy Management",
    tag: "Physiotherapy Management",
    headline: "Structured Physiotherapy for Complete Recovery",
    body:
      "Our physiotherapy management programs focus on pain relief, mobility restoration, and strength rebuilding through scientifically guided rehabilitation plans designed for long-term functional recovery.",
    sub: "",
  },
];

export default function PhysiotherapyManagementPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={physiotherapySlides} showBookSessionButton id="physiotherapy-management-hero" />
      <BrandIntroduction
        eyebrow="Introduction"
        title="Your Path to Safe & Effective Recovery"
        description="Injuries, surgeries, posture-related strain, or lifestyle conditions can affect your ability to move comfortably and perform daily activities. Without proper rehabilitation, these issues may lead to recurring pain, reduced mobility, and long-term functional limitations."
        paragraph1="At Postura by Physio, we provide comprehensive physiotherapy management programs that follow a progressive recovery approach — starting from pain control and moving towards strength restoration and functional independence. Our goal is not just temporary relief, but sustainable healing and improved physical performance."
        highlight=""
        image1={{ src: "/physio-1.jpg", alt: "Physiotherapy exercise session" }}
        image2={{ src: "/physio-2.jpg", alt: "One-on-one physiotherapy care" }}
      />
      <CommonChallenges
        eyebrow="Common Challenges"
        title="Conditions That Benefit from Physiotherapy Care"
        description="From injury recovery and pain management to mobility improvement and posture correction, our guided rehabilitation approach supports safer movement and long-term functional wellness."
        bullets={[
          "Post-surgical stiffness and muscle weakness",
          "Sports injuries and ligament strain",
          "Chronic neck, back, or joint pain",
          "Reduced mobility due to sedentary lifestyle",
          "Balance and coordination challenges",
          "Recurring posture-related discomfort",
        ]}
        image={{ src: "/physio-3.jpg", alt: "Physiotherapy rehabilitation session" }}
        watermarkSrc="/logo-svg.png"
      />
      <StructuredFitnessSolutions
        eyebrow="How Our Physiotherapy Management Program Helps"
        title={"Structured Support for\nComplete Physical\nRecovery"}
        description="Through targeted exercises and clinically guided rehabilitation methods, we help individuals improve flexibility, regain strength, and return to daily activities with greater comfort and stability."
        items={[
          {
            title: "Aerobics",
            description: "Builds stamina and improves physical capacity.",
            imageSrc: "/physio-aerobics.jpg",
            imageAlt: "Aerobics",
          },
          {
            title: "Physiotherapy",
            description: "Reduces pain and restores joint mobility.",
            imageSrc: "/physio-physio.jpg",
            imageAlt: "Physiotherapy",
          },
          {
            title: "Yoga",
            description: "Improves flexibility and prevents stiffness.",
            imageSrc: "/physio-yoga.jpg",
            imageAlt: "Yoga",
          },
          {
            title: "Pilates",
            description: "Strengthens core and supports stable movement.",
            imageSrc: "/physio-pilates.jpg",
            imageAlt: "Pilates",
          },
        ]}
      />
      <KeyBenefits
        eyebrow="Key Benefit's"
        title="Recovery & Mobility Benefits"
        description="From pain relief and improved movement control to increased strength and daily performance, our guided rehabilitation programs support safer recovery and long-term physical well-being."
        bullets={[
          "Effective pain reduction and improved comfort",
          "Restored mobility and functional independence",
          "Increased strength and physical endurance",
          "Reduced risk of injury recurrence",
          "Improved posture and movement control",
          "Better quality of daily life and activity performance",
        ]}
        image={{ src: "/physio-4.jpg", alt: "Physiotherapy recovery session" }}
        flipImageX={false}
      />
      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Start Your Journey Towards Stronger<br/> Recovery" ctaDescription="Experience structured physiotherapy care designed to help you move freely, regain strength, and return to<br/> your active lifestyle with confidence." />
    </div>
  );
}