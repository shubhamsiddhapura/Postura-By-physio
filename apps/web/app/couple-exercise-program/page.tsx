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
  title: "Couple Exercise Program",
  description:
    "A couple exercise program designed to build consistency, improve strength and mobility, and make fitness more enjoyable with partner-based training.",
  alternates: { canonical: `${SITE_URL}/couple-exercise-program` },
  openGraph: {
    title: "Couple Exercise Program",
    description:
      "Physiotherapist-guided partner workouts designed to build strength, improve flexibility, and stay motivated together.",
    url: `${SITE_URL}/couple-exercise-program`,
    images: [
      {
        url: "/couple-hero.png",
        width: 1200,
        height: 630,
        alt: "Couple exercise program at Postura by Physio",
      },
    ],
  },
};

const coupleSlides = [
  {
    src: "/couple-hero.png",
    mobileSrc: "/couple-hero.png",
    alt: "Couple exercise program at Postura by Physio",
    tag: "Couple Exercise Program",
    headline: "Stay Fit Together with<br/> Couple Workouts",
    body: "Enjoy physiotherapist-guided fitness sessions designed for couples to build strength, improve flexibility, and stay motivated together.",
    sub: "",
  },
];

const couplePrograms: AdvancedTreatmentItem[] = [
  { title: "Mobility\n& Warm-Up", imageSrc: "/physio-yoga.jpg", imageAlt: "Mobility and warm-up drills" },
  { title: "Core\n& Posture", imageSrc: "/swiss-1.jpg", imageAlt: "Core and posture training" },
  { title: "Strength\n& Endurance", imageSrc: "/physio-4.jpg", imageAlt: "Strength and endurance workouts" },
  { title: "Recovery\n& Stretch", imageSrc: "/physio-2.jpg", imageAlt: "Cool down and stretching" },
];

const coupleHowItWorksSteps: ApproachStep[] = [
  { key: "01", title: "Shared Motivation", position: "top" as const },
  { key: "02", title: "Consistent Participation", position: "bottom" as const },
  { key: "03", title: "Improved Strength & Flexibility", position: "top" as const },
  { key: "04", title: "Better Coordination", position: "bottom" as const },
  { key: "05", title: "Long-Term Fitness Habits", position: "top" as const },
];

const whyChooseCoupleItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-guided\nsessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Guided sessions icon" width={30} height={30} />,
  },
  {
    title: "Customized workouts\nfor both individuals",
    iconElement: <Image src="/aerobics-svg-2.svg" alt="Customized workouts icon" width={30} height={30} />,
  },
  {
    title: "Safe and structured\ntraining approach",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="Structured training icon" width={30} height={30} />,
  },
  {
    title: "Suitable for all fitness\nlevels",
    iconElement: <Image src="/aerobics-svg-5.svg" alt="All fitness levels icon" width={30} height={30} />,
  },
  {
    title: "Focus on fun and long-\nterm consistency",
    iconElement: <Image src="/aerobics-svg-4.svg" alt="Long-term consistency icon" width={30} height={30} />,
  },
];

export default function CoupleExerciseProgramPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={coupleSlides} id="couple-exercise-program-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title={
            <>
              Fitness That Brings You
              <br />
              Closer
            </>
          }
          description="At Postura by Physio, our Couple Exercise Program is designed to make fitness more engaging, consistent, and enjoyable by working out together."
          description2="Whether you’re partners, friends, or family members, exercising as a pair helps boost motivation, accountability, and overall results. Our sessions combine fun, structured workouts with professional guidance to ensure safe and effective training for both individuals."
          image={{ src: "/couple-1.jpg", alt: "Couple exercise program" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:-mt-10">
        <OurApproachTimeline
          id="how-couple-program-works"
          eyebrow="How it Works"
          title={
            <>
              How Couple Training
              <br />
              Improves Fitness
            </>
          }
          description="Working out together builds motivation, improves consistency, and enhances strength,<br/> flexibility, and overall fitness through shared effort."
          steps={coupleHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10">
        <CommonChallenges
          backgroundClassName="bg-[#E0EFEF] py-10"
          eyebrow="Benefits"
          title={"Benefits of Couple\nExercise Programs"}
          description="Achieve your fitness goals together with structured and engaging sessions."
          bullets={[
            "Increased motivation and consistency",
            "Improved strength and flexibility",
            "Better coordination and teamwork",
            "Enhanced emotional connection",
            "Reduced workout stress and boredom",
            "Fun and engaging fitness experience",
          ]}
          image={{ src: "/couple-2.png", alt: "Couple exercise program benefits" }}
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-couple-exercise-program"
          eyebrow="Why Choose"
          title={
            <>
              Why Choose Our
              <br />
              Couple Exercise Program
            </>
          }
          description="A structured and enjoyable approach that helps couples stay motivated, improve fitness together, and build long-term healthy habits."
          items={whyChooseCoupleItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Train Together. Stay Strong Together."
        ctaDescription="Join our couple exercise program and enjoy a healthier, more active lifestyle with your partner."
      />
    </div>
  );
}

