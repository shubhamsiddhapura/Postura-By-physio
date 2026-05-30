import type { Metadata } from "next";
import Image from "next/image";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { AdvancedTreatmentCarousel } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { OurApproachTimeline } from "@/components/Physiotherapy/OurApproachTimeline";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Yoga Program",
  description:
    "Our yoga program is designed to improve mobility, posture, strength, and calm through structured, guided practice.",
  alternates: { canonical: `${SITE_URL}/yoga-program` },
  openGraph: {
    title: "Yoga Program",
    description:
      "Therapeutic and power yoga sessions designed to improve flexibility, reduce stress, and support overall physical and mental well-being.",
    url: `${SITE_URL}/yoga-program`,
    images: [
      {
        url: "/yoga-hero.png",
        width: 1200,
        height: 630,
        alt: "Yoga program at Postura by Physio",
      },
    ],
  },
};

const yogaProgramSlides = [
  {
    src: "/yoga-hero.png",
    mobileSrc: "/yoga-hero.png",
    alt: "Yoga program at Postura by Physio",
    tag: "Yoga Program",
    headline: "Balance Your Body &<br/> Mind with Yoga<br/> Therapy",
    body: "Experience therapeutic and power yoga sessions designed to improve flexibility, reduce stress, and support overall physical and mental well-being.",
    sub: "",
  },
];

const yogaPrograms = [
  { title: "Therapeutic Yoga", imageSrc: "/yoga-slide-1.jpg", imageAlt: "Therapeutic Yoga" },
  { title: "Power Yoga", imageSrc: "/yoga-slide-2.jpg", imageAlt: "Vinyasa Flow" },
  { title: "Stress Relief Yoga", imageSrc: "/yoga-slide-3.jpg", imageAlt: "Therapeutic Yoga" },
  { title: "PCOD / PCOS Yoga", imageSrc: "/yoga-slide-4.jpg", imageAlt: "Prenatal Yoga" },
  { title: "Thyroid Support Yoga", imageSrc: "/yoga-slide-5.jpg", imageAlt: "Senior-Friendly Yoga" },
  { title: "Pranayama", imageSrc: "/yoga-slide-6.jpg", imageAlt: "Senior-Friendly Yoga" },
];

const yogaHowItWorksSteps = [
  { key: "01", title: "Controlled Movements + Breath Awareness", position: "top" as const },
  { key: "02", title: "Improved Circulation & Oxygen Supply", position: "bottom" as const },
  { key: "03", title: "Better Nervous System Balance", position: "top" as const },
  { key: "04", title: "Enhanced Flexibility & Strength", position: "bottom" as const },
  { key: "05", title: "Improved Physical & Mental Well-being", position: "top" as const },
];

const whyChooseYogaItems: WhyChooseUsItem[] = [
  {
    title: "Physiotherapist-\nguided sessions",
    iconElement: <Image src="/aerobics-svg-1.svg" alt="Guided sessions icon" width={30} height={30} />,
  },
  {
    title: "Customized programs for health conditions",
    iconElement: <Image src="/aerobics-svg-2.svg" alt="Customized program icon" width={30} height={30} />,
  },
  {
    title: "Safe and structured approach",
    iconElement: <Image src="/aerobics-svg-3.svg" alt="Safe and structured icon" width={30} height={30} />,
  },
  {
    title: "Combination of therapy and fitness",
    iconElement: <Image src="/aerobics-svg-5.svg" alt="Therapy and fitness icon" width={30} height={30} />,
  },
  {
    title: "Suitable for all age groups",
    iconElement: <Image src="/yoga-age.svg" alt="All age groups icon" width={30} height={30} />,
  },
];

export default function YogaProgramPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={yogaProgramSlides} id="yoga-program-hero" showBookSessionButton />

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Introduction"
          title="Holistic Wellness Through Guided Yoga"
          description="At Postura by Physio, our Yoga & Power Yoga Therapy Program combines traditional yoga practices with clinical understanding to support both physical and mental health."
          description2="These sessions are carefully designed to improve flexibility, strengthen muscles, enhance posture, and reduce stress through controlled movements and breathwork. Whether you are looking for relaxation, rehabilitation, or fitness, our yoga programs are tailored to your individual needs."
          image={{ src: "/yoga-program-1.jpg", alt: "yoga program" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      <div className="md:mt-16 mt-10">
        <AdvancedTreatmentCarousel
          id="our-yoga-programs"
          eyebrow="Programs"
          title="Our Yoga Therapy Programs"
          description="Customized yoga sessions designed to address specific health needs and wellness goals."
          items={yogaPrograms}
        />
      </div>

      <div className="">
        <OurApproachTimeline
          id="how-yoga-improves"
          eyebrow="How it Works"
          title={
            <>
              How Yoga Improves
              <br />
              Your Health
            </>
          }
          description="Through guided poses and breath awareness, yoga helps balance the body,<br/> reduce stress, and improve strength and mobility."
          steps={yogaHowItWorksSteps}
        />
      </div>

      <div className="lg:mt-60 mt-10 md:pb-10 bg-white">
        <CommonChallenges
          eyebrow="Benefits"
          title={"Benefits of Yoga Therapy"}
          description="Support your body and mind with structured and guided yoga practices."
          bullets={[
            "Improves flexibility and muscle strength",
            "Reduces stress and anxiety",
            "Enhances posture and balance",
            "Supports hormonal and metabolic health",
            "Improves breathing and lung capacity",
            "Promotes overall wellness and relaxation",
          ]}
          image={{ src: "/yoga-program-2.jpg", alt: "Yoga program" }}
        />
      </div>

      <div className="pb-10 md:pb-20 bg-white">
        <WhyChooseUs
          id="why-choose-yoga-program"
          eyebrow="Why Choose"
          title="Why Choose Our Yoga Therapy Program"
          description="Customized yoga programs designed to address individual health needs while ensuring safe, effective, and long-term wellness results."
          items={whyChooseYogaItems}
          mdColumns={5}
        />
      </div>

      <Footer
        ctaTitle="Begin Your Journey to Inner Balance"
        ctaDescription="Join our yoga therapy program to improve flexibility, reduce stress, and achieve complete physical and mental wellness."
      />
    </div>
  );
}

