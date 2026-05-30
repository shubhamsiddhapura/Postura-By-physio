import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { WhoCanJoin } from "@/components/Home/WhoCanJoin";
import { AdvancedTreatmentCarousel } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { OurApproachTimeline } from "@/components/Physiotherapy/OurApproachTimeline";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Physiotherapy",
  description:
    "Hands-on physiotherapy, guided exercise, and recovery support at home, in your society, or online — personalized plans for pain relief, mobility, and strength.",
  alternates: { canonical: `${SITE_URL}/physiotherapy` },
  openGraph: {
    title: "Physiotherapy",
    description:
      "Hands-on physiotherapy, guided exercise, and recovery support — personalized plans for pain relief, mobility, and strength.",
    url: `${SITE_URL}/physiotherapy`,
    images: [
      {
        url: "/physiotherapy-hero.png",
        width: 1200,
        height: 630,
        alt: "Physiotherapy",
      },
    ],
  },
};

const physiotherapyServiceSlides = [
  {
    src: "/physiotherapy-hero.png",
    mobileSrc: "/physiotherapy-hero.png",
    alt: "Physiotherapy",
    tag: "Physiotherapy",
    headline: "Expert Physiotherapy<br/> for Pain Relief &<br/> Recovery",
    body:
      "Restore movement, reduce pain, and improve your quality of life with our personalized physiotherapy programs designed for safe and long-term recovery.",
    sub: "",
  },
];

const approachSteps = [
  { key: "01", title: "Assessment", position: "top" as const },
  { key: "02", title: "Identify Root Cause", position: "bottom" as const },
  { key: "03", title: "Targeted Treatment", position: "top" as const },
  { key: "04", title: "Strength Restoration", position: "bottom" as const },
  { key: "05", title: "Long-Term Recovery & Prevention", position: "top" as const },
];

export default function PhysiotherapyServicePage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={physiotherapyServiceSlides} showBookSessionButton id="physiotherapy-service-hero" />

      <OurApproachTimeline id="our-approach" steps={approachSteps} />

<div className="lg:mt-40"> 

      <WhoCanJoin
        id="physiotherapy-services"
        eyebrow="Physiotherapy Services"
        title={
          <>
            Our Physiotherapy
            <br />
            Services
          </>
        }
        description="Comprehensive rehabilitation solutions tailored to your condition and recovery goals."
        cards={[
          {
            title: "Orthopedic Rehabilitation",
            subtitle: "Treatment for joint pain, fractures, ligament injuries, and post-surgical recovery",
            imageSrc: "/physio-service-1.jpg",
          },
          {
            title: "Neurological Rehabilitation",
            subtitle: "Improves mobility, coordination, and functional independence for neurological conditions",
            imageSrc: "/physio-service-2.jpg",
          },  
          {
            title: "Cardio Rehabilitation",
            subtitle: "Enhances lung capacity, breathing efficiency, and endurance",
            imageSrc: "/physio-service-3.jpg",
          },
          {
            title: "Women’s Physiotherapy",
            subtitle: "Supports pre- and post-natal recovery, pelvic floor strengthening, and overall maternal health",
            imageSrc: "/physio-service-4.jpg",
          },
          {
            title: "Geriatric Rehabilitation",
            subtitle: "Focuses on balance, mobility, and fall prevention for seniors",
            imageSrc: "/physio-service-5.jpg",
          },
          {
            title: "Postural Correction",
            subtitle: "Designed for corporate and desk-based professionals to reduce pain and improve posture",
            imageSrc: "/physio-service-6.jpg",
          },
        ]}
      />
</div>

      <div className="md:mt-16 mt-10">
        <AdvancedTreatmentCarousel
          id="advanced-treatment-techniques"
          items={[
            {
              title: "Corrective Exercises",
              imageSrc: "/at-7.jpg",
              imageAlt: "Corrective Exercises",
            },
            {
              title: "Theraband Strength",
              imageSrc: "/at-1.jpg",
              imageAlt: "Theraband Strength",
            },
            {
              title: "Cupping Therapy",
              imageSrc: "/at-2.jpg",
              imageAlt: "Cupping Therapy",
            },
            {
              title: "Manual Therapy",
              imageSrc: "/at-3.jpg",
              imageAlt: "Manual Therapy",
            },
            {
              title: "Dry Needling",
              imageSrc: "/at-4.jpg",
              imageAlt: "Dry Needling",
            },
            {
              title: "Functional Training",
              imageSrc: "/at-5.jpg",
              imageAlt: "Functional Training",
            },
            {
              title: "Flexibar Therapy",
              imageSrc: "/at-6.jpg",
              imageAlt: "Flexibar Therapy",
            },
            {
              title: "Swiss Ball Training",
              imageSrc: "/at-8.jpg",
              imageAlt: "Swiss Ball Training",
            },
          ]}
        />
      </div>

      <div className="md:mt-24 mt-10 md:pb-20 pb-10 bg-white">
        <CommonChallenges
          eyebrow="Benefits"
          title={"Benefits of Physiotherapy"}
          description="Improve your overall physical health and daily performance."
          bullets={[
            "Pain relief and reduced discomfort",
            "Improved mobility and flexibility",
            "Enhanced strength and endurance",
            "Better posture and body alignment",
            "Reduced risk of recurring injuries",
            "Improved quality of life",
          ]}
          image={{ src: "/physio-service-0.jpg", alt: "Physiotherapy session" }}
        />
      </div>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Start Your Recovery Journey Today"
        ctaDescription="Don’t let pain limit your daily life. Book a physiotherapy session and take the first step towards better movement and long-term wellness."
      />
    </div>
  );
}
