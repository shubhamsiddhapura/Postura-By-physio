import type { Metadata } from "next";
import { Flag, ListChecks, ScanEye, ShieldCheck, Users } from "lucide-react";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { ServicesSection } from "@/components/Home/ServicesSection";
import { WellnessProgramsSection } from "@/components/Home/WellnessProgramsSection";
import { SpecializedProgramsCarousel } from "@/components/Home/SpecializedProgramsCarousel";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";
import Image from "next/image";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Physiotherapy, yoga, Pilates, aerobics, and preventive care at Postura by Physio — at home in Vadodara, in your society, or online.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "Services",
    description:
      "Physiotherapy, yoga, Pilates, aerobics, and preventive care at Postura by Physio — at home, in your society, or online.",
    url: `${SITE_URL}/services`,
    images: [
      {
        url: "/services-hero.png",
        width: 1200,
        height: 630,
        alt: "Postura by Physio services",
      },
    ],
  },
};

const whyChoosePosturaItems: WhyChooseUsItem[] = [
  {
    title: "Personalized assessment programs",
    iconElement: <Image src="/s-svg-1.svg" alt="Personalized assessment programs" width={30} height={30} />,
  },
  {
    title: "Expert physiotherapist guidance",
    iconElement: <Image src="/s-svg-2.svg" alt="Expert physiotherapist guidance" width={30} height={30} />,
  },
  {
    title: "Safe and structured approach",
    iconElement: <Image src="/s-svg-3.svg" alt="Safe and structured approach" width={30} height={30} />,
  },
  {
    title: "Suitable for all age groups",
    iconElement: <Image src="/s-svg-4.svg" alt="Suitable for all age groups" width={30} height={30} />,
  },
  {
    title: "Focus on long-term results and prevention",
    iconElement: <Image src="/s-svg-5.svg" alt="Focus on long-term results and prevention" width={30} height={30} />,
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
      <div className="py-10 md:py-20">
        <CommonChallenges
          eyebrow="Service Intro"
          title="Comprehensive Care for Every Stage of Life"
          description="At Postura by Physio, we offer a combination of clinical physiotherapy and guided fitness programs to support recovery, strength building, and overall wellness."
          description2="Our services are designed for individuals across all age groups from corporate professionals and athletes to seniors and mothers ensuring safe, effective, and personalized care for every need."
          image={{ src: "/services-0.jpg", alt: "common symptoms" }}
        />
      </div>

      <div className="pb-10">
        <ServicesSection
          id="services-programs"
          overlapFooter={false}
          eyebrow="Core offerings"
          title={
            <>
              Explore Our Core
              <br />
              Wellness Programs
            </>
          }
          description="From physiotherapy to guided fitness, pick the path that fits your goals — delivered at home, in your society, or online. Every program is structured for safe progress and lasting results."
        />
      </div>


      <WellnessProgramsSection />

      <SpecializedProgramsCarousel />


      <div className="pb-10 md:pb-20 pt-10 bg-white">
        <WhyChooseUs
          id="why-choose-postura-services"
          eyebrow="Why Choose"
          title="Why Choose Postura by Physio"
          description="Expert care designed around your body, your goals, and your lifestyle."
          items={whyChoosePosturaItems}
          mdColumns={5}
        />
      </div>
      <Footer ctaDescription="Whether you are recovering from pain or looking to improve your fitness, our expert team is here to guide you." />
    </div>
  );
}
