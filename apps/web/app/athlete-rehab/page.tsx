import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Athlete Rehab",
  description:
    "Sports rehabilitation programs combining physiotherapy, endurance training, and functional fitness to support injury recovery and safe return to peak performance.",
  alternates: { canonical: `${SITE_URL}/athlete-rehab` },
  openGraph: {
    title: "Athlete Rehab",
    description:
      "Sports rehabilitation programs combining physiotherapy, endurance training, and functional fitness to support injury recovery and safe return to peak performance.",
    url: `${SITE_URL}/athlete-rehab`,
    images: [
      { url: "/athlete-hero.png", width: 1200, height: 630, alt: "Athlete Rehab" },
    ],
  },
};

const athleteSlides = [
  {
    src: "/athlete-hero.png",
    mobileSrc: "/athlete-hero.png",
    alt: "Athlete Rehab",
    tag: "Athlete Rehab",
    headline: "Sports Rehabilitation<br/> for Stronger<br/> Performance",
    body:
      "Our athlete rehabilitation programs combine advanced physiotherapy techniques, endurance training, and functional fitness to support injury recovery, improve strength, and help athletes return to peak performance safely.",
    sub: "",
  },
];

export default function AthleteRehabPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={athleteSlides} showBookSessionButton id="athlete-rehab-hero" />
      <BrandIntroduction
        eyebrow="Introduction"
        title="Your Journey Back to Peak Performance"
        description="Athletes often push their bodies to the limit, which can increase the risk of injuries, muscle imbalances, and performance setbacks. Without proper rehabilitation and structured recovery, these issues may lead to reduced endurance, recurring injuries, and delayed return to sport."
        paragraph1="At Postura by Physio, we provide specialized sports rehabilitation programs that focus on progressive healing, functional strength development, agility training, and performance readiness. Our goal is to help athletes recover effectively, regain confidence, and achieve optimal physical conditioning."
        highlight=""
        image1={{ src: "/athlete-1.jpg", alt: "Athlete rehabilitation training" }}
        image2={{ src: "/athlete-2.jpg", alt: "Sports recovery session" }}
      />
      <CommonChallenges
        eyebrow="Common Challenges"
        title="Athletic Performance Challenges"
        description="Injuries, stiffness, and reduced stamina can affect training and performance. Our guided sports rehabilitation approach helps athletes recover effectively, rebuild strength, and regain confidence in movement."
        bullets={[
          "Muscle strain and ligament injuries",
          "Reduced flexibility and joint mobility",
          "Core weakness affecting balance and power",
          "Risk of recurring injuries due to improper recovery",
          "Loss of endurance and sport-specific performance",
          "Mental stress and fear of re-injury",
        ]}
        image={{ src: "/athlete-3.jpg", alt: "Athlete rehabilitation session" }}
        watermarkSrc="/logo-svg.png"
        flipImageX
      />
      <StructuredFitnessSolutions
        eyebrow="How Our Athlete Rehab Program Helps"
        title={"Guided Recovery for\nPeak Athletic\nPerformance"}
        description="Through targeted rehabilitation exercises and performance-focused training, we help athletes restore mobility, increase stamina, and safely regain competitive strength."
        items={[
          {
            title: "Physiotherapy",
            description: "Manages pain and rebuilds strength for safe return.",
            imageSrc: "/athlete-physio.jpg",
            imageAlt: "Physiotherapy",
          },
          {
            title: "Yoga",
            description: "Enhances flexibility and mental focus.",
            imageSrc: "/athlete-yoga.jpg",
            imageAlt: "Yoga",
          },
          {
            title: "Pilates",
            description: "Strengthens core and improves power control.",
            imageSrc: "/athlete-pilates.jpg",
            imageAlt: "Pilates",
          },
        ]}
      />
      <KeyBenefits
        eyebrow="Key Benefit's"
        title="Athletic Recovery Benefits"
        description="From improved strength and mobility to better endurance and injury prevention, our guided rehabilitation programs help athletes perform with greater confidence and long-term physical resilience."
        bullets={[
          "Faster and safer injury recovery",
          "Improved flexibility, balance, and coordination",
          "Enhanced core strength and functional stability",
          "Reduced risk of future injuries",
          "Increased endurance and sport-specific performance",
          "Greater confidence and mental readiness",
        ]}
        image={{ src: "/athlete-4.jpg", alt: "Athlete recovery and strength training" }}
        flipImageX
      />
      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Train Smarter. Recover Stronger. Perform<br/> Better." ctaDescription="Join our structured sports rehabilitation programs to regain strength, improve performance, and return to your<br/> sport with confidence." />
    </div>
  );
}