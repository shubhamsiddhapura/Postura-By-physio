import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Geriatric Rehabilitation",
  description:
    "Safe, supportive geriatric rehabilitation programs to improve mobility, balance, and strength for seniors through gentle, physiotherapist-guided exercises.",
  alternates: { canonical: `${SITE_URL}/geriatric-rehabilitation` },
  openGraph: {
    title: "Geriatric Rehabilitation",
    description:
      "Improve mobility, balance, and strength for seniors with gentle, physiotherapist-guided rehabilitation that promotes independence and well-being.",
    url: `${SITE_URL}/geriatric-rehabilitation`,
    images: [
      {
        url: "/gr-hero.png",
        width: 1200,
        height: 630,
        alt: "Geriatric Rehabilitation",
      },
    ],
  },
};

const aboutSlides = [
    {
        src: "/gr-hero.png",
        mobileSrc: "/gr-hero.png",
        alt: "Geriatric Rehabilitation",
        tag: "Geriatric Rehabilitation",
        headline:
            "Safe & Supportive<br/> Rehabilitation for<br/> Healthy Aging",
        body: "Our geriatric rehabilitation programs are designed to improve mobility, balance, and strength for seniors through gentle, physiotherapist-guided exercises that promote independence and overall well-being.",
        sub: "",
    },
];

export default function GeriatricRehabilitationPage() {
    return (
        <div className="md:overflow-x-visible">
            <HeroSection slides={aboutSlides} showBookSessionButton id="geriatric-rehabilitation-hero" />
            <BrandIntroduction
                eyebrow="Introduction"
                title="Helping Seniors Stay Active & Independent"
                description="As we age, natural changes in muscle strength, joint flexibility, and balance can make daily activities more challenging. Seniors often experience stiffness, reduced stamina, or fear of falling, which can affect confidence and quality of life."
                paragraph1="At Postura by Physio, we provide specialized geriatric rehabilitation programs that focus on safe movement, functional strength, and gradual recovery. Our goal is to help seniors stay active, independent, and comfortable in their everyday routines."
                highlight=""
                image1={{ src: "/gr-1.jpg", alt: "Physiotherapy session" }}
                image2={{ src: "/gr-2.jpg", alt: "Posture correction session" }}
            />
            <CommonChallenges
                eyebrow="Common Challenges"
                title="Common Physical Challenges in Aging"
                description="With increasing age, many seniors experience joint stiffness, reduced balance, muscle weakness, and lower endurance, which can affect daily mobility and confidence."
                bullets={[
                    "Joint stiffness and reduced flexibility",
                    "Difficulty in walking or maintaining balance",
                    "Muscle weakness and reduced endurance",
                    "Increased risk of falls or injuries",
                    "Pain due to arthritis or age-related conditions",
                    "Reduced confidence in performing daily activities",
                ]}
                image={{ src: "/gr-3.jpg", alt: "Physiotherapy session" }}
                watermarkSrc="/logo-svg.png"
                flipImageX
            />
             <StructuredFitnessSolutions
                eyebrow="How Our Geriatric Rehabilitation Program Helps"
                title={"Structured Fitness\nSolutions for Workplace\nWellness"}
                description="Through guided movement, posture correction, and targeted strengthening, our programs help corporate professionals manage stress, prevent injuries, and maintain long-term physical well-being."
                items={[
                  {
                    title: "Aerobics",
                    description: "Improves mobility and stamina.",
                    imageSrc: "/gr-aerobics.jpg",
                    imageAlt: "Aerobics",
                  },
                  {
                    title: "Physiotherapy",
                    description: "Reduces stiffness and builds strength.",
                    imageSrc: "/gr-physio.jpg",
                    imageAlt: "Physiotherapy",
                  },
                  {
                    title: "Yoga",
                    description: "Enhances balance and flexibility.",
                    imageSrc: "/gr-yoga.jpg",
                    imageAlt: "Yoga",
                  },
                  {
                    title: "Pilates",
                    description: "Supports posture and independence.",
                    imageSrc: "/gr-pilates.jpg",
                    imageAlt: "Pilates",
                  },
                ]}
             />
            <KeyBenefits
                eyebrow="Key Benefit’s"
                title="Senior Wellness Benefits"
                description="From improved mobility and reduced pain to better balance and energy levels, our programs help seniors stay active, confident, and independent in their everyday lives."
                bullets={[
                    "Improved walking confidence and balance control",
                    "Reduced joint pain and stiffness",
                    "Increased strength for daily activities",
                    "Better posture and functional mobility",
                    "Lower risk of falls and injuries",
                    "Enhanced energy levels and overall well-being",
                ]}
                image={{ src: "/gr-4.jpg", alt: "Senior wellness session" }}
                flipImageX
            />
            <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Support Healthy Aging with Guided<br/> Rehabilitation" ctaDescription="Help your loved ones stay active, confident, and independent with our specialized geriatric wellness programs." />
        </div>
    );
}

