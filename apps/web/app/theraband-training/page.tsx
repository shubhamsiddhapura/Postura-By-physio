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
  title: "Theraband Training",
  description:
    "Theraband (resistance band) training to improve strength, mobility, posture, and joint stability with a safe, progressive, physiotherapist-guided approach.",
  alternates: { canonical: `${SITE_URL}/theraband-training` },
  openGraph: {
    title: "Theraband Training",
    description:
      "Improve strength, mobility, posture, and joint stability with safe, progressive resistance band training guided by a physiotherapist.",
    url: `${SITE_URL}/theraband-training`,
    images: [
      {
        url: "/theraband-1.png",
        width: 1200,
        height: 630,
        alt: "Theraband training at Postura by Physio",
      },
    ],
  },
};

const therabandSlides = [
  {
    src: "/theraband-hero.png",
    mobileSrc: "/theraband-hero.png",
    alt: "Theraband training at Postura by Physio",
    tag: "Theraband Training",
    headline: "Strengthen Safely<br/> with Theraband<br/> Training",
    body: "Experience physiotherapist-guided resistance training using therabands to improve strength, mobility, and joint stability through controlled and low-impact exercises.",
    sub: "",
  },
];

const therabandPrograms: AdvancedTreatmentItem[] = [
  { title: "Mobility\nPrep", imageSrc: "/physio-yoga.jpg", imageAlt: "Mobility prep" },
  { title: "Activation\n& Control", imageSrc: "/physio-2.jpg", imageAlt: "Activation and control" },
  { title: "Strength\nProgression", imageSrc: "/physio-4.jpg", imageAlt: "Strength progression" },
  { title: "Recovery\n& Stretch", imageSrc: "/physio-1.jpg", imageAlt: "Recovery and stretching" },
];

const therabandHowItWorksSteps: ApproachStep[] = [
  { key: "01", title: "Elastic Resistance", position: "top" as const },
  { key: "02", title: "Muscle Activation", position: "bottom" as const },
  { key: "03", title: "Improved Joint Stability", position: "top" as const },
  { key: "04", title: "Increased Strength & Control", position: "bottom" as const },
  { key: "05", title: "Better Functional Movement", position: "top" as const },
];

const whyChooseTherabandItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-\nsupervised sessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Supervised sessions icon" width={30} height={30} />,
  },
  {
    title: "Safe and progressive\nresistance training",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="Progressive resistance icon" width={30} height={30} />,
  },
  {
    title: "Customized intensity\nlevels",
    iconElement: <Image src="/aerobics-svg-2.svg" alt="Customized intensity icon" width={30} height={30} />,
  },
  {
    title: "Suitable for\nrehabilitation & fitness",
    iconElement: <Image src="/aerobics-svg-5.svg" alt="Rehabilitation and fitness icon" width={30} height={30} />,
  },
  {
    title: "Focus on long-term\nstrength and stability",
    iconElement: <Image src="/aerobics-svg-4.svg" alt="Long-term strength icon" width={30} height={30} />,
  },
];

export default function TherabandTrainingPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={therabandSlides} id="theraband-training-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title={
            <>
              Effective Resistance
              <br />
              Training for All Levels
            </>
          }
          description="At Postura by Physio, our Theraband Training Program focuses on improving muscle strength, flexibility, and joint control using elastic resistance bands."
          description2="This method allows for safe, progressive training suitable for rehabilitation, fitness improvement, and injury prevention. Theraband exercises are gentle on joints while effectively activating muscles, making them ideal for individuals of all age groups and fitness levels."
          image={{ src: "/theraband-1.png", alt: "Theraband training session" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:-mt-10">
        <OurApproachTimeline
          id="how-theraband-works"
          eyebrow="How it Works"
          title={
            <>
              How Theraband Training
              <br />
              Improves Your Body
            </>
          }
          description="Theraband exercises enhance muscle control, increase strength, and<br/> support safe movement with low-impact resistance training."
          steps={therabandHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10">
        <CommonChallenges
          backgroundClassName="bg-[#E0EFEF] py-10"
          eyebrow="Benefits"
          title={"Benefits of Theraband\nTraining"}
          description="Build strength and stability with safe and controlled resistance training."
          bullets={[
            "Improves muscle strength and endurance",
            "Enhances joint stability and control",
            "Reduces risk of injury",
            "Supports rehabilitation and recovery",
            "Increases flexibility and mobility",
            "Suitable for all fitness levels",
          ]}
          image={{ src: "/theraband-2.png", alt: "Theraband training benefits" }}
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-theraband-training"
          eyebrow="Why Choose"
          title={
            <>
              Why Choose Our
              <br />
              Theraband Training
            </>
          }
          description="Our physiotherapist-guided sessions ensure safe, progressive resistance training that improves strength, joint stability, and overall movement control."
          items={whyChooseTherabandItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Build Strength with Safe Resistance<br/> Training"
        ctaDescription="Join our Theraband training program and improve your strength, stability, and overall movement with guided support."
      />
    </div>
  );
}

