import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { StructuredFitnessSolutions } from "@/components/Common/StructuredFitnessSolutions";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const aboutSlides = [
    {
        src: "/corporate-hero.png",
        mobileSrc: "/corporate-hero.png",
        alt: "IT / Corporate Professionals",
        tag: "IT / Corporate Professionals",
        headline:
            "Corporate Wellness & Physiotherapy<br/> Programs",
        body: "Designed for IT and desk-based professionals, our structured fitness and physiotherapy programs help reduce pain, improve posture, and boost daily productivity through guided movement and preventive care.",
        sub: "",
    },
];

export default function CorporateProfessionalsPage() {
    return (
        <div className="md:overflow-x-visible">
            <HeroSection slides={aboutSlides} showBookSessionButton id="corporate-professionals-hero" />
            <BrandIntroduction
                eyebrow="Introduction"
                title="Corporate Wellness for Better Productivity"
                description="In today’s digital work environment, long sitting hours, repetitive tasks, and high stress levels can lead to posture-related pain, fatigue, and reduced work performance."
                paragraph1="At Postura by Physio, we provide specialized corporate fitness and rehabilitation programs tailored for IT professionals and desk-job employees. Our scientifically structured sessions combine aerobics, yoga, Pilates, and physiotherapy to help you stay active, pain-free, and productive throughout your workday."
                highlight=""
                image1={{ src: "/cp-1.jpg", alt: "Physiotherapy session" }}
                image2={{ src: "/cp-2.jpg", alt: "Posture correction session" }}
            />
            <CommonChallenges />
            <StructuredFitnessSolutions />
            <KeyBenefits flipImageX={true} />
            <Footer />
        </div>
    );
}

