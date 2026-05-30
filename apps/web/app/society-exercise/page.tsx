import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Society Exercise Sessions",
  description:
    "Structured society exercise sessions bringing fitness and physiotherapy guidance to residential communities—helping people stay active, connected, and healthy.",
  alternates: { canonical: `${SITE_URL}/society-exercise` },
  openGraph: {
    title: "Society Exercise Sessions",
    description:
      "Community-based fitness programs with physiotherapy guidance to help residents of all ages stay active, motivated, and healthy.",
    url: `${SITE_URL}/society-exercise`,
    images: [
      {
        url: "/society-hero.png",
        width: 1200,
        height: 630,
        alt: "Society Exercise Sessions",
      },
    ],
  },
};

const societySlides = [
  {
    src: "/society-hero.png",
    mobileSrc: "/society-hero.png",
    alt: "Society Exercise Sessions",
    tag: "Society Exercise Sessions",
    headline: "Community Fitness<br/> Programs for<br/> Healthier",
    body:
      "Our society exercise sessions bring structured fitness and physiotherapy guidance directly to residential communities, helping individuals of all age groups stay active, connected, and physically healthy.",
    sub: "",
  },
];

export default function SocietyExercisePage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={societySlides} showBookSessionButton id="society-exercise-hero" />
      <BrandIntroduction
        eyebrow="Introduction"
        title="Fitness That Brings Communities Together"
        description="In today's fast-paced lifestyle, many individuals struggle to maintain regular fitness routines due to time constraints, travel difficulties, or lack of motivation. Society-based fitness sessions provide a convenient and engaging way for residents to stay active within their own community environment."
        paragraph1="At Postura by Physio, we offer professionally guided group exercise programs designed to promote accessible wellness, social interaction, and consistent healthy habits. These sessions help create a supportive atmosphere where individuals can exercise safely while building stronger neighborhood connections."
        highlight=""
        image1={{ src: "/society-1.jpg", alt: "Community fitness session" }}
        image2={{ src: "/society-2.jpg", alt: "Group exercise class" }}
      />
      <CommonChallenges
        eyebrow="Common Challenges"
        title="Community Lifestyle Health Challenges"
        description="Irregular workouts and inactive routines can affect both physical fitness and overall well-being. Our guided group sessions help residents stay motivated, active, and committed to healthier daily habits."
        bullets={[
          "Irregular exercise habits due to busy schedules",
          "Lack of motivation to work out alone",
          "Limited access to professional fitness guidance",
          "Sedentary routines leading to reduced stamina and flexibility",
          "Increased risk of lifestyle-related health issues",
          "Social isolation affecting mental well-being",
        ]}
        image={{ src: "/society-3.jpg", alt: "Community yoga session" }}
        watermarkSrc="/logo-svg.png"
      />
      <StructuredFitnessSolutions
        eyebrow="How Our Society Fitness Program Helps"
        title={"Guided Fitness Support\nfor Community\nWellness"}
        description="Through structured group exercises and physiotherapy-based movement training, we help residents stay active, reduce discomfort, and develop healthier daily routines in a supportive community environment."
        items={[
          {
            title: "Aerobics",
            description: "Boosts energy and encourages active participation.",
            imageSrc: "/society-aerobics.jpg",
            imageAlt: "Aerobics",
          },
          {
            title: "Physiotherapy",
            description: "Relieves stiffness and improves everyday movement.",
            imageSrc: "/society-physio.jpg",
            imageAlt: "Physiotherapy",
          },
          {
            title: "Yoga",
            description: "Reduces stress and improves flexibility.",
            imageSrc: "/society-yoga.jpg",
            imageAlt: "Yoga",
          },
          {
            title: "Pilates",
            description: "Strengthens core and builds endurance.",
            imageSrc: "/society-pilates.jpg",
            imageAlt: "Pilates",
          },
        ]}
      />
      <KeyBenefits
        eyebrow="Key Benefit's"
        title="Benefits of Society Fitness & Wellness Programs"
        description="From improved fitness and daily energy to better motivation and social bonding, our society sessions help residents stay active, healthier, and more connected in their everyday lives."
        bullets={[
          "Easy access to professional fitness sessions within the society",
          "Strengthened pelvic floor and core stability",
          "Increased motivation through group participation",
          "Stronger social connections and community bonding",
          "Reduced lifestyle-related discomfort and stress",
          "Development of consistent and sustainable fitness routines",
        ]}
        image={{ src: "/society-4.jpg", alt: "Society wellness session" }}
        flipImageX={false}
      />
      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Build a Healthier Community Together" ctaDescription="Encourage active living and stronger social connections through our professionally guided society fitness<br/> programs." />
    </div>
  );
}