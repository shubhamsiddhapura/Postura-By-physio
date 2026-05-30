"use client";

import { useCallback, useState } from "react";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import {
  PatientInteractionQuestionnaire,
  DEFAULT_PATIENT_ANSWERS,
  type AnswerKey,
  type PatientInteractionAnswers,
} from "../../components/PatientInteraction/PatientInteractionQuestionnaire";
import { RecommendedProgramSection } from "../../components/PatientInteraction/RecommendedProgramSection";
import { HealthSummaryModal } from "../../components/PatientInteraction/HealthSummaryModal";

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

const QUESTIONNAIRE_SECTION_ID = "patient-interaction-questionnaire";

export function PatientInteractionExperience() {
  const [answers, setAnswers] = useState<PatientInteractionAnswers>(DEFAULT_PATIENT_ANSWERS);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleAnswerChange = useCallback((key: AnswerKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleEditDetails = useCallback(() => {
    setModalOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(QUESTIONNAIRE_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      <HealthSummaryModal
        open={modalOpen}
        onClose={closeModal}
        onEditDetails={handleEditDetails}
        answers={answers}
      />
      <div className="md:overflow-x-visible">
        <HeroSection
          slides={patientInteractionSlides}
          id="patient-interaction-hero"
          showBookSessionButton
          bookSessionOnClick={openModal}
        />
        <PatientInteractionQuestionnaire
          sectionId={QUESTIONNAIRE_SECTION_ID}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
        <RecommendedProgramSection
          onBookSessionClick={openModal}
          answers={answers}
        />
        <Footer
          ctaTitle="Get Your Personalized Treatment Plan"
          ctaDescription="Book a detailed assessment with our experts to receive a customized physiotherapy and wellness plan tailored to your needs."
        />
      </div>
    </>
  );
}
