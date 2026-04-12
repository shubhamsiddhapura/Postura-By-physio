import type { Metadata } from "next";
import { PersonStanding, Repeat2, Sofa, Brain } from "lucide-react";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";

export const metadata: Metadata = {
  title: "Our Services | Postura by Physio",
  description:
    "Physiotherapy, yoga, Pilates, aerobics, and preventive care at Postura by Physio — at home in Vadodara, in your society, or online.",
};

const neckPainDeskJobItems: WhyChooseUsItem[] = [
  {
    title: "Prolonged Sitting & Poor Posture",
    description:
      "Continuous screen use often leads to forward head posture, rounded shoulders, and increased strain on cervical muscles.",
    icon: PersonStanding,
  },
  {
    title: "Repetitive Work Movements",
    description:
      "Constant typing, mouse usage, and minimal movement throughout the day can create muscle tension and reduced joint mobility.",
    icon: Repeat2,
  },
  {
    title: "Sedentary Lifestyle & Weak Muscles",
    description:
      "Limited physical activity weakens postural support muscles, especially in the neck, shoulders, and core.",
    icon: Sofa,
  },
  {
    title: "Stress & Mental Fatigue",
    description:
      "Work deadlines and mental pressure can cause unconscious muscle tightening, further increasing neck stiffness and discomfort.",
    icon: Brain,
  },
];

const servicesSlides = [
  {
    src: "/services-hero.png",
    mobileSrc: "/services-hero.png",
    alt: "Postura by Physio services",
    tag: "Core Services",
    headline: "Our Services",
    body: "Explore our range of physiotherapy and wellness programs designed to improve mobility, reduce pain, and support long-term health through structured and personalized care.",
    sub: "",
  },
];

export default function ServicesPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={servicesSlides} id="services-page-hero" showBookSessionButton />
       <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Service Intro"
          title="Comprehensive Care for Every Stage of Life"
          description="At Postura by Physio, we offer a combination of clinical physiotherapy and guided fitness programs to support recovery, strength building, and overall wellness."
          description2="Our services are designed for individuals across all age groups from corporate professionals and athletes to seniors and mothers ensuring safe, effective, and personalized care for every need."
          image={{ src: "/blog-symptoms.jpg", alt: "common symptoms" }}
        />
        </div>
        <div className="pt-10">
        <WhyChooseUs
          id="neck-pain-desk-jobs"
          eyebrow="Why Neck Pain is Common Among IT Professionals"
          title="Common Causes of Neck Pain in Desk Jobs"
          description="Sedentary routines, forward head posture, and workplace stress often contribute to muscle tension and cervical discomfort. Understanding these factors is the first step toward effective prevention and recovery."
          items={neckPainDeskJobItems}
          mdColumns={4}
        />
      </div>
      <Footer ctaDescription="Whether you are recovering from pain or looking to improve your fitness, our expert team is here to guide you."/>
    </div>
  );
}
