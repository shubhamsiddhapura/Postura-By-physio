import type { Metadata } from "next";
import Image from "next/image";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { AdvancedTreatmentCarousel } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { OurApproachTimeline } from "@/components/Physiotherapy/OurApproachTimeline";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Pilates Program",
  description:
    "Our Pilates program is designed to build core strength, improve posture, and enhance mobility with safe, structured training.",
  alternates: { canonical: `${SITE_URL}/pilates-program` },
  openGraph: {
    title: "Pilates Program",
    description:
      "Build core strength, improve posture, and enhance mobility with safe, structured Pilates training guided by a physiotherapist.",
    url: `${SITE_URL}/pilates-program`,
    images: [
      {
        url: "/pilates-hero.png",
        width: 1200,
        height: 630,
        alt: "Pilates program at Postura by Physio",
      },
    ],
  },
};

const pilatesProgramSlides = [
  {
    src: "/pilates-hero.png",
    mobileSrc: "/pilates-hero.png",
    alt: "Pilates program at Postura by Physio",
    tag: "Pilates Program",
    headline: "Build Strength &<br/> Stability with Pilates",
    body: "Experience physiotherapist-guided Pilates training designed to improve core strength, posture, and controlled body movement for long-term physical stability.",
    sub: "",
  },
];

const pilatesPrograms = [
  { title: "Foundation\nActivation", imageSrc: "/pilates-1.png", imageAlt: "Foundation Activation" },
  { title: "Strength\nDevelopment", imageSrc: "/pilates-2.png", imageAlt: "Strength Development" },
  { title: "Advanced Stability &\nCoordination", imageSrc: "/pilates-3.png", imageAlt: "Advanced Stability & Coordination" },
  { title: "Functional\nPerformance Level", imageSrc: "/pilates-4.png", imageAlt: "Functional Performance Level" },
];

const pilatesHowItWorksSteps = [
  { key: "01", title: "Controlled Movements", position: "top" as const },
  { key: "02", title: "Deep Core Activation", position: "bottom" as const },
  { key: "03", title: "Improved Spinal Stability", position: "top" as const },
  { key: "04", title: "Better Posture & Balance", position: "bottom" as const },
  { key: "05", title: "Reduced Strain & Injury Risk", position: "top" as const },
];

const whyChoosePilatesItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-\nsupervised sessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Supervised sessions icon" width={30} height={30} />,
  },
  {
    title: "Posture + core\nfocused training",
    iconElement: <Image src="/4-level.svg" alt="Core training icon" width={30} height={30} />,
  },
  {
    title: "Safe for all age\ngroups",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="All age groups icon" width={30} height={30} />,
  },
  {
    title: "Progressive strength\n& stability building",
    iconElement: <Image src="/aerobics-svg-5.svg" alt="Strength and stability icon" width={30} height={30} />,
  },
  {
    title: "Long-term mobility\n& balance",
    iconElement: <Image src="/aerobics-svg-4.svg" alt="Mobility and balance icon" width={30} height={30} />,
  },
];

export default function PilatesProgramPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={pilatesProgramSlides} id="pilates-program-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title={
            <>
              Strengthen Your Core
              <br />
              with Controlled
              <br />
              Movement
            </>
          }
          description="At Postura by Physio, our Pilates Program focuses on developing deep core strength, improving posture, and enhancing body control through structured and precise movements."
          description2="Unlike traditional workouts, Pilates emphasizes quality over quantity — helping you move better, reduce strain on joints, and build a strong foundation for daily activities and overall fitness."
          image={{ src: "/pilates-program-1.jpg", alt: "pilates program" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:mt-16 mt-10">
        <AdvancedTreatmentCarousel
          id="our-pilates-programs"
          eyebrow="Programs"
          title={
            <>
              Our 4-Level Progressive<br/> Pilates System
            </>
          }
          description="A step-by-step approach designed to build strength safely and effectively."
          items={pilatesPrograms}
        />
      </div>

      <div className="">
        <OurApproachTimeline
          id="how-pilates-works"
          eyebrow="How it Works"
          title={
            <>
              How Pilates Improves
              <br />
              Your Body
            </>
          }
          description="Controlled movements activate deep core muscles, improve spinal stability,<br/> and enhance posture for better overall body strength and balance."
          steps={pilatesHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10 bg-white">
        <CommonChallenges
          eyebrow="Benefits"
          title={"Benefits of Pilates Training"}
          description="Improve strength, posture, and overall body control with structured Pilates sessions."
          bullets={[
            "Strengthens core muscles",
            "Improves posture and alignment",
            "Enhances balance and coordination",
            "Reduces back and neck strain",
            "Increases flexibility and mobility",
            "Supports injury prevention",
          ]}
          image={{ src: "/pilates-program-2.png", alt: "Pilates program" }}
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-pilates-program"
          eyebrow="Why Choose"
          title="Why Choose Our Pilates Program"
          description="Designed for all fitness levels, our programs combine safety, customization, and progressive training for long-term results."
          items={whyChoosePilatesItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaTitle="Start Your Pilates Journey Today"
        ctaDescription="Join our Pilates program and experience stronger core control, better posture, and improved mobility."
      />
    </div>
  );
}

