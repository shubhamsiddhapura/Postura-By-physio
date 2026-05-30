import type { Metadata } from "next";
import Image from "next/image";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { OurApproachTimeline, type ApproachStep } from "@/components/Physiotherapy/OurApproachTimeline";
import { AdvancedTreatmentCarousel, type AdvancedTreatmentItem } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Flexibar Training",
  description:
    "Flexibar training to improve strength, mobility, posture, and joint stability with a safe, progressive, physiotherapist-guided approach.",
  alternates: { canonical: `${SITE_URL}/flexibar-training` },
  openGraph: {
    title: "Flexibar Training",
    description:
      "Physiotherapist-guided vibration-based training to improve muscle activation, joint stability, and overall body control.",
    url: `${SITE_URL}/flexibar-training`,
    images: [
      {
        url: "/flexibar-hero.png",
        width: 1200,
        height: 630,
        alt: "Flexibar training at Postura by Physio",
      },
    ],
  },
};

const flexibarSlides = [
  {
    src: "/flexibar-hero.png",
    mobileSrc: "/flexibar-hero.png",
    alt: "Flexibar training at Postura by Physio",
    tag: "Flexibar Training",
    headline: "Enhance Stability &<br/> Strength with Flexibar Training",
    body: "Experience physiotherapist-guided Flexibar exercises designed to improve muscle activation, joint stability, and overall body control through vibration-based training.",
    sub: "",
  },
];

const therabandPrograms: AdvancedTreatmentItem[] = [
  { title: "Mobility\nPrep", imageSrc: "/physio-yoga.jpg", imageAlt: "Mobility prep" },
  { title: "Activation\n& Control", imageSrc: "/physio-2.jpg", imageAlt: "Activation and control" },
  { title: "Strength\nProgression", imageSrc: "/physio-4.jpg", imageAlt: "Strength progression" },
  { title: "Recovery\n& Stretch", imageSrc: "/physio-1.jpg", imageAlt: "Recovery and stretching" },
];

const flexibarHowItWorksSteps: ApproachStep[] = [
  { key: "01", title: "Vibration-Based Movement", position: "top" as const },
  { key: "02", title: "Deep Muscle Activation", position: "bottom" as const },
  { key: "03", title: "Improved Neuromuscular Control", position: "top" as const },
  { key: "04", title: "Enhanced Stability & Strength", position: "bottom" as const },
  { key: "05", title: "Better Functional Performance", position: "top" as const },
];

const whyChooseFlexibarItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-\nsupervised sessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Supervised sessions icon" width={30} height={30} />,
  },
  {
    title: "Safe and structured\nprogression",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="Structured progression icon" width={30} height={30} />,
  },
  {
    title: "Suitable for rehab and\nfitness",
    iconElement: <Image src="/aerobics-svg-5.svg" alt="Rehabilitation and fitness icon" width={30} height={30} />,
  },
  {
    title: "Focus on stability and\ncoordination",
    iconElement: <Image src="/flexibar-svg-4.svg" alt="Stability and coordination icon" width={30} height={30} />,
  },
  {
    title: "Personalized training\napproach",
    iconElement: <Image src="/flexibar-svg-5.svg" alt="Personalized training icon" width={30} height={30} />,
  },
];

export default function FlexibarTrainingPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={flexibarSlides} id="flexibar-training-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title={
            <>
              Dynamic Training for
              <br />
              Deep Muscle
              <br />
              Activation
            </>
          }
          description="At Postura by Physio, our Flexibar Training Program focuses on improving neuromuscular coordination, core stability, and joint strength through controlled vibration-based movements."
          description2="Flexibar exercises create rapid muscle contractions that activate deep stabilizing muscles, making it highly effective for rehabilitation, posture correction, and performance enhancement."
          image={{ src: "/flexibar-1.png", alt: "Flexibar training session" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:-mt-10">
        <OurApproachTimeline
          id="how-flexibar-works"
          eyebrow="How it Works"
          title={
            <>
              How Flexibar Training
              <br />
              Improves Your Body
            </>
          }
          description="Vibration-based movements activate deep stabilizing muscles, improving<br/> strength, coordination, and overall body control."
          steps={flexibarHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10">
        <CommonChallenges
          backgroundClassName="bg-[#E0EFEF] py-10"
          eyebrow="Benefits"
          title={"Benefits of Flexibar\nTraining"}
          description="Improve strength, coordination, and stability with advanced vibration-based exercises."
          bullets={[
            "Activates deep stabilizing muscles",
            "Improves joint stability and control",
            "Enhances coordination and balance",
            "Supports rehabilitation and injury prevention",
            "Increases strength and endurance",
            "Improves posture and body alignment",
          ]}
          image={{ src: "/flexibar-2.png", alt: "Flexibar training benefits" }}
          flipImageX
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-flexibar-training"
          eyebrow="Why Choose"
          title={
            <>
              Why Choose Our
              <br />
              Flexibar Training
            </>
          }
          description="Our physiotherapist-guided sessions use structured vibration training to improve stability, coordination, and deep muscle strength safely and effectively."
          items={whyChooseFlexibarItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Train Smarter with Advanced Stability<br/> Training"
        ctaDescription="Join our Flexibar training program and experience improved strength, control, and performance."
      />
    </div>
  );
}

