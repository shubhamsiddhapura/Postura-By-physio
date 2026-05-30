import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CircleDashed, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { AdvancedTreatmentCarousel, type AdvancedTreatmentItem } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { OurApproachTimeline, type ApproachStep } from "@/components/Physiotherapy/OurApproachTimeline";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Swiss Ball Training",
  description:
    "Swiss ball training to build core stability, balance, posture, and functional strength with a safe, progressive program guided by professionals.",
  alternates: { canonical: `${SITE_URL}/swiss-ball-training` },
  openGraph: {
    title: "Swiss Ball Training",
    description:
      "Physiotherapist-guided Swiss ball exercises to enhance core stability, posture, and full-body coordination through controlled, dynamic movement.",
    url: `${SITE_URL}/swiss-ball-training`,
    images: [
      {
        url: "/swiss-hero.png",
        width: 1200,
        height: 630,
        alt: "Swiss ball training at Postura by Physio",
      },
    ],
  },
};

const swissBallSlides = [
  {
    // Placeholder asset (swap to /swiss-ball-hero.png when available)
    src: "/swiss-hero.png",
    mobileSrc: "/swiss-hero.png",
    alt: "Swiss ball training at Postura by Physio",
    tag: "Swiss Ball Training",
    headline: "Improve Balance &<br/> Core Strength with<br/> Swiss Ball Training",
    body: "Experience physiotherapist-guided Swiss ball exercises designed to enhance core stability, posture, and full-body coordination through controlled and dynamic movements.",
    sub: "",
  },
];

const swissBallPrograms: AdvancedTreatmentItem[] = [
  { title: "Foundation\nStability", imageSrc: "/physio-1.jpg", imageAlt: "Foundation stability exercises" },
  { title: "Core\nActivation", imageSrc: "/physio-2.jpg", imageAlt: "Core activation on Swiss ball" },
  { title: "Balance &\nCoordination", imageSrc: "/physio-3.jpg", imageAlt: "Balance and coordination drills" },
  { title: "Functional\nStrength", imageSrc: "/physio-4.jpg", imageAlt: "Functional strength training" },
];

const swissBallHowItWorksSteps: ApproachStep[] = [
  { key: "01", title: "Unstable Surface Training", position: "top" as const },
  { key: "02", title: "Deep Muscle Activation", position: "bottom" as const },
  { key: "03", title: "Improved Core Stability", position: "top" as const },
  { key: "04", title: "Better Balance & Coordination", position: "bottom" as const },
  { key: "05", title: "Enhanced Functional Movement", position: "top" as const },
];

const whyChooseSwissBallItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-\nsupervised sessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Supervised sessions icon" width={30} height={30} />,
  },
  {
    title: "Safe and structured\nprogression",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="Structured progression icon" width={30} height={30} />,
  },
  {
    title: "Suitable for beginners\nto advanced levels",
    iconElement: <Image src="/4-level.svg" alt="All levels icon" width={30} height={30} />,
  },
  {
    title: "Focus on posture and\ncore stability",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Core stability icon" width={30} height={30} />,
  },
  {
    title: "Personalized training\napproach",
    iconElement: <Image src="/aerobics-svg-4.svg" alt="Personalized training icon" width={30} height={30} />,
  },
];

export default function SwissBallTrainingPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={swissBallSlides} id="swiss-ball-training-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title={
            <>
              Dynamic Training for
              <br />
              Stability & Control
            </>
          }
          description="At Postura by Physio, our Swiss Ball Training program focuses on improving core strength, balance, and coordination through instability-based exercises."
          description2="The use of a Swiss ball challenges your muscles to stay engaged, helping activate deep stabilizing muscles that are often not targeted in traditional workouts. This leads to better posture, reduced injury risk, and improved functional movement in daily life."
          image={{ src: "/swiss-1.jpg", alt: "Swiss ball training session" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:-mt-10">
        <OurApproachTimeline
          id="how-swiss-ball-works"
          eyebrow="How it Works"
          title={
            <>
              How Swiss Ball Training
              <br />
              Improves Your Body
            </>
          }
          description="Swiss ball exercises engage stabilizing muscles, strengthen the core, and<br/> improve coordination through controlled movement."
          steps={swissBallHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10">
        <CommonChallenges
          backgroundClassName="bg-[#E0EFEF] py-10"
          eyebrow="Benefits"
          title={"Benefits of Swiss Ball Training"}
          description="Build strength, improve posture, and enhance movement with instability-based exercises."
          bullets={[
            "Strengthens core and stabilizing muscles",
            "Improves balance and coordination",
            "Enhances posture and body alignment",
            "Reduces risk of injuries",
            "Increases flexibility and mobility",
            "Supports functional fitness",
          ]}
          image={{ src: "/swiss-2.jpg", alt: "Swiss ball training benefits" }}
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-swiss-ball-training"
          eyebrow="Why Choose"
          title={
            <>
              Why Choose Our Swiss
              <br />
              Ball Training
            </>
          }
          description="Our physiotherapist-guided sessions ensure safe, progressive training that improves core stability, balance, and overall body control."
          items={whyChooseSwissBallItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaTitle="Build Stability. Move with Confidence."
        ctaDescription="Join our Swiss ball training program and improve your balance, strength, and overall body control."
      />
    </div>
  );
}

