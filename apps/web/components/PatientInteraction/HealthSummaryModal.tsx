"use client";

import { useEffect } from "react";
import type { PatientInteractionAnswers } from "./PatientInteractionQuestionnaire";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

type HealthSummaryModalProps = {
  open: boolean;
  onClose: () => void;
  onEditDetails: () => void;
  onConfirmBook: () => void;
  answers: PatientInteractionAnswers;
};

const SUGGESTED_PROGRAM_COPY =
  "Based on your inputs, we recommend a Postural Correction & Physiotherapy Program to improve your posture, reduce pain, and restore comfortable movement.";

export function HealthSummaryModal({
  open,
  onClose,
  onEditDetails,
  onConfirmBook,
  answers,
}: HealthSummaryModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-y-contain p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] md:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="health-summary-title"
        className="relative z-[101] my-auto w-[min(100%,740px)] max-h-[min(92dvh,920px)] max-w-[740px] overflow-y-auto overscroll-contain rounded-tl-[16px] rounded-br-[16px] rounded-tr-[56px] rounded-bl-[56px] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] max-md:[scrollbar-gutter:stable] sm:p-6 md:max-h-none md:overflow-visible md:rounded-tl-[24px] md:rounded-br-[24px] md:rounded-tr-[120px] md:rounded-bl-[120px] md:p-9"
      >
        <h2
          id="health-summary-title"
          className="text-balance text-xl font-bold tracking-tight text-gray-900 min-[400px]:text-2xl md:text-[1.75rem] md:leading-snug"
        >
          Your Personalized Health Summary
        </h2>
        <p className="mt-3 max-w-[520px] text-pretty text-sm leading-relaxed text-gray-500 md:text-[15px]">
          Please confirm your details before we recommend your program and proceed with booking.
        </p>

        <div className="mt-6 rounded-tl-[12px] rounded-br-[12px] rounded-tr-[36px] rounded-bl-[36px] bg-[#E0EFEF] px-4 py-5 md:mt-8 md:rounded-tl-[18px] md:rounded-br-[18px] md:rounded-tr-[78px] md:rounded-bl-[78px] md:px-7 md:py-8">
          <h3 className="text-base font-bold text-black md:text-lg">Selected Details</h3>

          <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3.5 min-[480px]:grid-cols-2 md:mt-5 md:gap-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-black">Your Profile:</p>
              <p className="text-sm font-semibold text-primary md:text-[15px]">{answers.about}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-black">Pain Area:</p>
              <p className="text-sm font-semibold text-primary md:text-[15px]">{answers.discomfort}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-black">Activity Level:</p>
              <p className="text-sm font-semibold text-primary md:text-[15px]">{answers.activity}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-black">Possible Cause:</p>
              <p className="text-sm font-semibold text-primary md:text-[15px]">{answers.cause}</p>
            </div>
          </div>

          <div className="my-5 h-px w-full bg-primary md:my-6" />

          <div>
            <p className="text-sm text-black">Suggested Program:</p>
            <p className="mt-2 text-pretty text-sm font-semibold leading-relaxed text-black md:text-[15px]">
              {SUGGESTED_PROGRAM_COPY}
            </p>
          </div>
        </div>

        <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:mt-8">
          <button
            type="button"
            onClick={onEditDetails}
            className="order-2 w-full min-w-0 shrink-0 rounded-full border border-[#D9D9D9] bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:order-1 sm:flex-1 sm:px-2"
          >
            Edit Details
          </button>
          <div className="order-1 flex w-full min-w-0 justify-center sm:order-2 sm:w-auto sm:flex-[1.35] sm:justify-end [&>div]:max-w-full sm:[&>div]:max-w-none">
            <PrimaryCTAButton
              href="#"
              label="Confirm & Book Your Session"
              size="md"
              arrowVariant="dark"
              className="pr-8 max-sm:w-full max-sm:min-w-0 max-sm:[&>button]:w-full max-sm:[&>button]:justify-center"
              onClick={(e) => {
                e.preventDefault();
                onConfirmBook();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
