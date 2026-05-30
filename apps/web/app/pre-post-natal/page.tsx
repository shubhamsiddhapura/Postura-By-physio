import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Pre & Post Natal Care",
  description:
    "Guided pre- and post-natal fitness and physiotherapy programs to support maternal health, reduce discomfort, improve posture, and recover safely after delivery.",
  alternates: { canonical: `${SITE_URL}/pre-post-natal` },
  openGraph: {
    title: "Pre & Post Natal Care",
    description:
      "Gentle strengthening, posture care, and guided rehabilitation to support maternal health, safe recovery, and long-term well-being.",
    url: `${SITE_URL}/pre-post-natal`,
    images: [
      { url: "/pn-hero.png", width: 1200, height: 630, alt: "Pre & Post Natal Care" },
    ],
  },
};

const aboutSlides = [
  {
    src: "/pn-hero.png",
    mobileSrc: "/pn-hero.png",
    alt: "Pre & Post Natal Care",
    tag: "Pre & Post Natal Care",
    headline: "Guided Fitness Care<br/> for Pregnancy and<br/> Motherhood",
    body:
      "Our pre- and post-natal wellness programs focus on gentle strengthening, posture care, and guided rehabilitation to support maternal health, safe recovery, and long-term physical well-being.",
    sub: "",
  },
];

export default function PrePostNatalPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={aboutSlides} showBookSessionButton id="pre-post-natal-hero" />
      <BrandIntroduction
        eyebrow="Introduction"
        title="Care for Every Stage of Motherhood"
        description="Pregnancy and the post-delivery phase bring significant physical and emotional changes to a woman’s body. Hormonal shifts, weight changes, muscle weakness, and posture strain can lead to discomfort, fatigue, and reduced mobility."
        paragraph1="At Postura by Physio, we provide specialized pre- and post-natal fitness and physiotherapy programs designed to support mothers at every stage — from pregnancy preparation to safe postpartum recovery. Our structured and low-impact approach helps improve strength, reduce pain, and restore confidence in daily movement."
        highlight=""
        image1={{ src: "/pn-1.jpg", alt: "Physiotherapy session" }}
        image2={{ src: "/pn-2.jpg", alt: "Posture correction session" }}
      />
      <CommonChallenges
        eyebrow="Common Challenges"
        title="Maternal Health Challenges"
        description="Physical changes during and after pregnancy may affect mobility, posture, and energy levels. Our structured programs focus on safe movement, pain relief, and restoring strength for a healthier motherhood journey."
        bullets={[
          "Lower back pain and pelvic discomfort",
          "Core muscle weakness and posture imbalance",
          "Reduced stamina and fatigue",
          "Pelvic floor weakness after delivery",
          "Difficulty returning to normal fitness routines",
          "Risk of improper exercise without professional guidance",
        ]}
        image={{ src: "/pn-3.jpg", alt: "Physiotherapy session" }}
        watermarkSrc="/logo-svg.png"
      />
      <StructuredFitnessSolutions
        eyebrow="How Our Pre & Post Natal Wellness Program Helps"
        title={"Structured Support for \nMaternal Strength & \nRecovery"}
        description="Through low-impact exercises and clinically guided rehabilitation, we help mothers stay active during pregnancy and recover safely after delivery while improving flexibility, stability, and overall well-being."
        items={[
          {
            title: "Aerobics",
            description: "Improves circulation and boosts daily energy.",
            imageSrc: "/pn-aerobics.jpg",
            imageAlt: "Aerobics",
          },
          {
            title: "Physiotherapy",
            description: "Strengthens pelvic floor and supports safe recovery.",
            imageSrc: "/pn-physio.jpg",
            imageAlt: "Physiotherapy",
          },
          {
            title: "Yoga",
            description: "Reduces stress and improves flexibility.",
            imageSrc: "/pn-yoga.jpg",
            imageAlt: "Yoga",
          },
          {
            title: "Pilates",
            description: "Rebuilds core strength and posture stability.",
            imageSrc: "/pn-pilates.jpg",
            imageAlt: "Pilates",
          },
        ]}
      />
      <KeyBenefits
        eyebrow="Key Benefit’s"
        title="Benefits of Pre & Post-Natal Wellness Programs"
        description="Our guided maternal fitness and rehabilitation programs help improve posture, strengthen pelvic and core muscles, and reduce pregnancy-related discomfort."
        bullets={[
          "Improved posture and reduced back or pelvic pain",
          "Strengthened pelvic floor and core stability",
          "Better stamina for daily caregiving activities",
          "Safer and faster postpartum recovery",
          "Enhanced flexibility and relaxation",
          "Increased confidence in returning to active lifestyle",
        ]}
        image={{ src: "/pn-4.jpg", alt: "Senior wellness session" }}
        flipImageX={false}
      />
      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Support Your Journey to a Healthier<br/> Motherhood" ctaDescription="Join our specialized pre- and post-natal wellness programs to stay strong, active, and confident during every<br/> stage of motherhood." />
    </div>
  );
}

