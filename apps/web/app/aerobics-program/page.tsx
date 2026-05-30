import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { AdvancedTreatmentCarousel } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { OurApproachTimeline } from "@/components/Physiotherapy/OurApproachTimeline";
import { WhyChooseUs, type WhyChooseUsItem } from "@/components/Home/WhyChooseUs";
import Image from "next/image";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
    title: "Aerobics Program",
    description:
        "Our aerobics program is designed to help you improve your cardiovascular health, strength, and flexibility.",
    alternates: { canonical: `${SITE_URL}/aerobics-program` },
    openGraph: {
        title: "Aerobics Program",
        description:
            "Physiotherapist-guided aerobics sessions designed to improve stamina, support heart health, and keep you active with safe, structured movement.",
        url: `${SITE_URL}/aerobics-program`,
        images: [
            {
                url: "/aerobics-program-hero.png",
                width: 1200,
                height: 630,
                alt: "Aerobics program at Postura by Physio",
            },
        ],
    },
};

const aerobicsProgramSlides = [
    {
        src: "/aerobics-program-hero.png",
        mobileSrc: "/aerobics-program-hero.png",
        alt: "Aerobics program at Postura by Physio",
        tag: "Aerobics Program",
        headline: "Boost Energy, Build Endurance with Aerobics",
        body: "Experience physiotherapist-guided aerobics sessions designed to improve stamina, support heart health, and keep you active with safe and structured movement.",
        sub: "",
    },
];

const aerobicsPrograms = [
    {
        title: "Corporate Aerobics",
        imageSrc: "/apat-1.jpg",
        imageAlt: "Corporate Aerobics",
    },
    {
        title: "HIIT Aerobics",
        imageSrc: "/apat-2.jpg",
        imageAlt: "HIIT Aerobics",
    },
    {
        title: "Floor Aerobics",
        imageSrc: "/apat-3.jpg",
        imageAlt: "Floor Aerobics",
    },
    {
        title: "Step Aerobics",
        imageSrc: "/apat-4.jpg",
        imageAlt: "Obesity Aerobics",
    },
    {
        title: "Obesity Aerobics",
        imageSrc: "/apat-5.jpg",
        imageAlt: "Obesity Aerobics",
    },
    {
        title: "Geriatric Aerobics",
        imageSrc: "/apat-6.jpg",
        imageAlt: "Geriatric Aerobics",
    },
];

const aerobicsHowItWorksSteps = [
    { key: "01", title: "Rhythmic Movement", position: "top" as const },
    { key: "02", title: "Improved Oxygen Circulation", position: "bottom" as const },
    { key: "03", title: "Stronger Cardiovascular System", position: "top" as const },
    { key: "04", title: "Increased Energy & Stamina", position: "bottom" as const },
];

const whyChooseAerobicsItems: WhyChooseUsItem[] = [
    {
        title: "Physiotherapist-\nsupervised sessions",
        iconElement: <Image src="/aerobics-svg-1.svg" alt="Supervised sessions icon" width={30} height={30} />,
    },
    {
        title: "Customized intensity\nlevels",
        iconElement: <Image src="/aerobics-svg-2.svg" alt="Customized intensity icon" width={30} height={30} />,
    },
    {
        title: "Safe for all age\ngroups",
        iconElement: <Image src="/aerobics-svg-3.svg" alt="All age groups icon" width={30} height={30} />,
    },
    {
        title: "Structured and\nprogressive workouts",
        iconElement: <Image src="/aerobics-svg-4.svg" alt="Progressive workouts icon" width={30} height={30} />,
    },
    {
        title: "Focus on long-term\nfitness",
        iconElement: <Image src="/aerobics-svg-5.svg" alt="Long-term fitness icon" width={30} height={30} />,
    },
];

export default function AerobicsProgramPage() {
    return (
        <div className="md:overflow-x-visible">
            <HeroSection slides={aerobicsProgramSlides} id="aerobics-program-hero" showBookSessionButton />
            <div className="pt-10 md:pt-20">
                <CommonChallenges
                    eyebrow="Introduction"
                    title="Move Better with Structured Aerobics Training"
                    description="At Postura by Physio, our Aerobics Program focuses on improving cardiovascular fitness, increasing energy levels, and enhancing overall physical endurance."
                    description2="These sessions are designed for all age groups and fitness levels, ensuring safe, enjoyable, and effective workouts under professional supervision. Whether your goal is weight management, improved stamina, or daily fitness, our structured approach helps you achieve long-term results."
                    image={{ src: "/aerobics-program-1.jpg", alt: "aerobics program" }}
                    watermarkSrc="/logo-svg.png"
                />
            </div>

            <div className="md:mt-16 mt-10">
                <AdvancedTreatmentCarousel
                    id="our-aerobics-programs"
                    eyebrow="Programs"
                    title="Our Aerobics Programs"
                    description="Choose from a variety of aerobics sessions tailored to your fitness level and goals."
                    items={aerobicsPrograms}
                />
            </div>

            <div className="">
                <OurApproachTimeline
                    id="how-aerobics-improves"
                    eyebrow="How it Works"
                    title={
                        <>
                            How Aerobics Improves
                            <br />
                            Your Fitness
                        </>
                    }
                    description="Structured movements that boost circulation, build endurance, and enhance<br/> overall energy levels for better daily performance."
                    steps={aerobicsHowItWorksSteps}
                />
            </div>

            <div className="lg:mt-60 mt-10 md:pb-10 bg-white">
                <CommonChallenges
                    eyebrow="Benefits"
                    title={"Benefits of Aerobics Training"}
                    description="Improve your overall fitness and daily performance with structured cardio workouts."
                    bullets={[
                        "Boosts heart health and stamina",
                        "Improves energy levels and endurance",
                        "Supports weight management",
                        "Enhances coordination and flexibility",
                        "Reduces stress and improves mood",
                        "Promotes an active lifestyle",
                    ]}
                    image={{ src: "/aerobics-program-2.jpg", alt: "Aerobics program" }}
                />
            </div>

            <div className="pb-10 md:pb-20 bg-white">
                <WhyChooseUs
                    id="why-choose-aerobics-program"
                    eyebrow="Why Choose"
                    title="Why Choose Our Aerobics Program"
                    description="Designed for all fitness levels, our programs combine safety, customization, and progressive training for long-term results."
                    items={whyChooseAerobicsItems}
                    mdColumns={5}
                />
            </div>

            <Footer
                ctaTitle="Start Your Fitness Journey Today"
                ctaDescription="Join our aerobics program and experience improved energy, better stamina, and a healthier lifestyle."
            />
        </div>
    );
}
