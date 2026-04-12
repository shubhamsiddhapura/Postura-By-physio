import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { PatientInteractionQuestionnaire } from "../../components/PatientInteraction/PatientInteractionQuestionnaire";
import { RecommendedProgramSection } from "../../components/PatientInteraction/RecommendedProgramSection";

export const metadata: Metadata = {
  title: "Patient Interaction | Postura by Physio",
  description:
    "How we work with patients at Postura by Physio — care, communication, and your recovery journey.",
};

const patientInteractionSlides = [
  {
    src: "/patient-hero.png",
    mobileSrc: "/patient-hero.png",
    alt: "Introduction  Session",
    tag: "Introduction Session",
    headline: "Tell Us About Your<br/> Condition",
    body: "Share a few details about your lifestyle and discomfort so we can recommend the most suitable physiotherapy and wellness program for you.",
    sub: "",
  },
];

export default function PatientInteractionPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={patientInteractionSlides} id="patient-interaction-hero" showBookSessionButton />
      <PatientInteractionQuestionnaire />
      <RecommendedProgramSection />
      <Footer
        ctaTitle="Get Your Personalized Treatment Plan"
        ctaDescription="Book a detailed assessment with our experts to receive a customized physiotherapy and wellness plan tailored to your needs."
      />
    </div>
  );
}
