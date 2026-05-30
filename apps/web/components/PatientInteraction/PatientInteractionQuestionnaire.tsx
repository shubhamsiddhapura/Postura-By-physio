"use client";

import Image from "next/image";
import { useState } from "react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

export type AnswerKey = "about" | "activity" | "discomfort" | "cause";

export type PatientInteractionAnswers = Record<AnswerKey, string>;

const QUESTIONS: Array<{
  key: AnswerKey;
  title: string;
  subtitle: string;
  options: string[];
}> = [
  {
    key: "about",
    title: "Tell Us About Yourself",
    subtitle: "This helps us understand your lifestyle and daily activity level.",
    options: [
      "IT / Software Professional",
      "Corporate / Desk Job",
      "Teacher / Standing Job",
      "Healthcare Worker",
      "Homemaker",
      "Athlete / Sports Person",
      "Senior Citizen",
      "Student",
      "Other",
    ],
  },
  {
    key: "activity",
    title: "Your Daily Activity Level",
    subtitle: "Understanding your routine helps us identify possible strain on your body.",
    options: [
      "Less than 4 hours sitting",
      "4 - 6 hours sitting",
      "6 - 8 hours sitting",
      "More than 8 hours sitting",
      "Long standing hours",
      "Physically demanding work",
    ],
  },
  {
    key: "discomfort",
    title: "Where Do You Feel Discomfort?",
    subtitle: "Select the area where you are experiencing pain or difficulty.",
    options: [
      "Neck",
      "Upper Back",
      "Lower Back",
      "Shoulder",
      "Ankle",
      "Knee",
      "Multiple Areas",
      "Balance / Walking Difficulty",
      "Breathing / Low Stamina",
    ],
  },
  {
    key: "cause",
    title: "What Could Be the Cause?",
    subtitle: "This helps us identify the root of your condition.",
    options: [
      "Prolonged sitting / Poor posture",
      "Recent surgery",
      "Sports injury",
      "Slip / Fall",
      "Pregnancy / Post-delivery",
      "Age-related weakness",
      "Neurological condition",
      "Post-COVID weakness",
      "Unknown",
    ],
  },
];

export const DEFAULT_PATIENT_ANSWERS: PatientInteractionAnswers = {
  about: "IT / Software Professional",
  activity: "Less than 4 hours sitting",
  discomfort: "Neck",
  cause: "Prolonged sitting / Poor posture",
};

type PatientInteractionQuestionnaireProps = {
  /** When set with `onAnswerChange`, answers are controlled by the parent (e.g. patient-interaction summary modal). */
  answers?: PatientInteractionAnswers;
  onAnswerChange?: (key: AnswerKey, value: string) => void;
  sectionId?: string;
};

export function PatientInteractionQuestionnaire({
  answers: controlledAnswers,
  onAnswerChange,
  sectionId,
}: PatientInteractionQuestionnaireProps = {}) {
  const [uncontrolled, setUncontrolled] =
    useState<PatientInteractionAnswers>(DEFAULT_PATIENT_ANSWERS);

  const isControlled = controlledAnswers !== undefined && onAnswerChange !== undefined;
  const answers = isControlled ? controlledAnswers : uncontrolled;

  const setAnswer = (key: AnswerKey, value: string) => {
    if (isControlled) {
      onAnswerChange(key, value);
    } else {
      setUncontrolled((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <section id={sectionId} className="bg-white">
      <div className="mx-auto max-w-[90vw] px-4 pt-16 md:px-4 md:pt-20">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1fr,1.1fr] md:items-end md:gap-12">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">Introduction</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Personalized Care<br/> Starts with<br/> Understanding You
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100}>
            <div className="space-y-4 text-center text-sm leading-7 text-gray-500 md:text-left">
              <p>
              Every individual has different health needs, lifestyle patterns, and physical challenges. To provide the most effective physiotherapy and wellness plan, we begin by understanding your daily routine, pain areas, and possible causes.
              </p>
              <p>
              This quick interaction will help us recommend the right treatment approach tailored specifically for you.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Questions */}
        <div className="mt-5 md:mt-10">
          {QUESTIONS.map((block, index) => (
            <FadeIn
              key={block.key}
              direction="up"
              distance={24}
              duration={700}
              delay={index * 40}
            >
              <div
                className={cn(
                  "py-8",
                  index > 0 && "border-t border-gray-200",
                )}
              >
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">{block.title}</h3>
                <p className="mt-2 text-sm text-gray-500 md:text-base">{block.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
                  {block.options.map((option) => {
                    const selected = answers[block.key] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswer(block.key, option)}
                        className={cn(
                          "rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border px-4 py-4 text-left text-xs font-medium transition md:text-sm",
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-300",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
