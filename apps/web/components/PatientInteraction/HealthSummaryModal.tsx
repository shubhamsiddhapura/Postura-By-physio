"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { PatientInteractionAnswers } from "./PatientInteractionQuestionnaire";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { BookingDateTimeField, type BookingSelection } from "../Contact/BookingDateTimeField";
import { clearInteractionAnswers } from "../../lib/booking/session";
import { cn } from "../../lib/utils";
import { ModernSelect } from "../ui/ModernSelect";

type HealthSummaryModalProps = {
  open: boolean;
  onClose: () => void;
  onEditDetails: () => void;
  onConfirmBook?: () => void;
  answers: PatientInteractionAnswers;
};

type Step = "form" | "review" | "confirmed";

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id: string }
  | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> };

const SUGGESTED_PROGRAM_COPY =
  "Based on your inputs, we recommend a Postural Correction & Physiotherapy Program to improve your posture, reduce pain, and restore comfortable movement.";

const fieldBaseClass =
  "h-11 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary";

/** Scroll still works; scrollbar track/thumb hidden (Firefox / WebKit / legacy Edge). */
const modalScrollNoBar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export function HealthSummaryModal({
  open,
  onClose,
  onEditDetails,
  onConfirmBook,
  answers,
}: HealthSummaryModalProps) {
  const [step, setStep] = useState<Step>("form");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [preferredDateTimeUtc, setPreferredDateTimeUtc] = useState<string | null>(null);
  const [patientTimezone, setPatientTimezone] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });

  const consultationOptions = useMemo(
    () =>
      [
        { value: "", label: "None" },
        { value: "Home visit", label: "Home visit" },
        { value: "Online", label: "Online" },
        { value: "Phone", label: "Phone" },
        { value: "Society / group", label: "Society / group" },
      ] satisfies Array<{ value: string; label: string }>,
    [],
  );

  // Reset to form step whenever modal reopens
  useEffect(() => {
    if (open) {
      setStep("form");
      setSubmission({ kind: "idle" });
      setFormErrors({});
    }
  }, [open]);

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

  const clearFieldError = useCallback((field: string) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateForm = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (at least 2 characters).";
    }
    if (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number (at least 7 digits).";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!preferredDateTime.trim()) {
      errors.preferredDateTime = "Please choose a preferred date and time.";
    }
    return errors;
  }, [fullName, phone, email, preferredDateTime]);

  const handleNextStep = useCallback(() => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setStep("review");
  }, [validateForm]);

  const handleConfirmBook = useCallback(async () => {
    if (submission.kind === "submitting") return;
    setSubmission({ kind: "submitting" });

    if (!preferredDateTimeUtc || !patientTimezone) {
      setSubmission({
        kind: "error",
        message: "Please choose a date and time from the calendar.",
        fieldErrors: {
          preferredDateTime: [
            "Please choose a date and time from the calendar.",
          ],
        },
      });
      return;
    }

    const payload: Record<string, unknown> = {
      program: "physiotherapy",
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferredDateTime: preferredDateTime.trim(),
      preferredDateTimeUtc,
      patientTimezone,
      consultationType: consultationType.trim() === "" ? null : consultationType,
      address: address.trim() === "" ? null : address.trim(),
      message: message.trim() === "" ? null : message.trim(),
      profileAbout: answers.about ?? null,
      activityLevel: answers.activity ?? null,
      discomfortArea: answers.discomfort ?? null,
      possibleCause: answers.cause ?? null,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setSubmission({
          kind: "error",
          message:
            data?.error ??
            "Something went wrong while submitting your booking. Please try again.",
          fieldErrors: data?.issues?.fieldErrors,
        });
        return;
      }

      clearInteractionAnswers();
      setSubmission({ kind: "success", id: data.data.id });
      setStep("confirmed");
      onConfirmBook?.();
    } catch (err) {
      setSubmission({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Network error. Please try again.",
      });
    }
  }, [
    submission.kind,
    fullName,
    phone,
    email,
    preferredDateTime,
    preferredDateTimeUtc,
    patientTimezone,
    consultationType,
    address,
    message,
    answers,
    onConfirmBook,
  ]);

  if (!open) return null;

  const fe = (field: string): string | undefined => {
    if (formErrors[field]) return formErrors[field];
    if (submission.kind !== "error") return undefined;
    return submission.fieldErrors?.[field]?.[0];
  };

  const isSubmitting = submission.kind === "submitting";

  // Shared layout: z-[100] backdrop, z-[101] positioner that handles centering.
  // Clicking the positioner (outside the dialog) closes the modal.
  // The dialog itself calls stopPropagation so inner clicks don't bubble up.
  const Backdrop = () => (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]" />
  );

  // Close button shown top-right of every dialog
  const CloseBtn = () => (
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 md:right-6 md:top-6"
    >
      <X className="h-4 w-4" />
    </button>
  );

  // ── Confirmation screen ────────────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <>
        <Backdrop />
        {/* Positioner — clicking here (outside dialog) closes */}
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          onClick={onClose}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="health-confirmed-title"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-[620px] max-h-[90dvh] overflow-y-auto overflow-x-hidden overscroll-contain rounded-tl-[16px] rounded-br-[16px] rounded-tr-[56px] rounded-bl-[56px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:rounded-tl-[24px] md:rounded-br-[24px] md:rounded-tr-[120px] md:rounded-bl-[120px]",
              modalScrollNoBar,
            )}
          >
            <div className="relative h-[240px] w-full shrink-0 md:h-[280px]">
              <Image
                src="/modal-img.png"
                alt="Session confirmed"
                fill
                className="object-cover object-top"
                sizes="520px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
            </div>
            <div className="px-6 py-8 text-center md:px-10 md:py-10">
              <h2
                id="health-confirmed-title"
                className="text-2xl font-bold tracking-tight text-gray-900 md:text-[1.75rem]"
              >
                Your Session Has Been Confirmed
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-[15px]">
                Thank you for booking with us. Your session request has been
                successfully submitted, and our team will contact you shortly to
                confirm your appointment details.
              </p>
              <div className="mt-7 flex justify-center">
                <PrimaryCTAButton
                  href="/"
                  label="Back to Home"
                  size="md"
                  arrowVariant="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Form + Review screens ─────────────────────────────────────────────────
  return (
    <>
      <Backdrop />
      {/* Positioner — clicking here (outside dialog) closes */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={step === "form" ? "health-form-title" : "health-summary-title"}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full max-w-[740px] max-h-[90dvh] overflow-y-auto overscroll-contain rounded-tl-[16px] rounded-br-[16px] rounded-tr-[56px] rounded-bl-[56px] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6 md:rounded-tl-[24px] md:rounded-br-[24px] md:rounded-tr-[120px] md:rounded-bl-[120px] md:p-9",
            modalScrollNoBar,
          )}
        >
          <CloseBtn />

          {/* ── Step indicator ────────────────────────────────────────────── */}
          <div className="mb-5 flex items-center gap-2 md:mb-7">
            {(["form", "review"] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    step === s
                      ? "bg-primary text-white"
                      : step === "review" && idx === 0
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  {idx + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    step === s ? "text-gray-900" : "text-gray-400",
                  )}
                >
                  {idx === 0 ? "Your Details" : "Review"}
                </span>
                {idx === 0 && (
                  <div
                    className={cn(
                      "mx-1 h-px w-8 transition-colors",
                      step === "review" ? "bg-primary/40" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Step 1: Form ──────────────────────────────────────────────── */}
          {step === "form" && (
            <>
              <h2
                id="health-form-title"
                className="text-balance text-xl font-bold tracking-tight text-gray-900 min-[400px]:text-2xl md:text-[1.75rem] md:leading-snug"
              >
                Book Your Session
              </h2>
              <p className="mt-3 max-w-[520px] text-pretty text-sm leading-relaxed text-gray-500 md:text-[15px]">
                Fill in your details below and we'll get back to you to confirm
                your appointment.
              </p>

              <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
                {/* Full Name */}
                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearFieldError("fullName"); }}
                    placeholder="Enter full name"
                    className={cn(fieldBaseClass, "mt-2", fe("fullName") && "border-red-400 focus:border-red-500")}
                  />
                  {fe("fullName") && <p className="mt-1 text-xs text-red-600">{fe("fullName")}</p>}
                </div>

                {/* Phone */}
                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">Phone no.</label>
                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      clearFieldError("phone");
                    }}
                    inputMode="tel"
                    pattern="[0-9]*"
                    placeholder="Enter phone no."
                    className={cn(fieldBaseClass, "mt-2", fe("phone") && "border-red-400 focus:border-red-500")}
                  />
                  {fe("phone") && <p className="mt-1 text-xs text-red-600">{fe("phone")}</p>}
                </div>

                {/* Email */}
                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">Email</label>
                  <input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                    inputMode="email"
                    type="email"
                    placeholder="Enter email"
                    className={cn(fieldBaseClass, "mt-2", fe("email") && "border-red-400 focus:border-red-500")}
                  />
                  {fe("email") && <p className="mt-1 text-xs text-red-600">{fe("email")}</p>}
                </div>

                {/* Preferred Date & Time */}
                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">
                    Preferred Date &amp; Time
                  </label>
                  <div className="mt-2">
                    <BookingDateTimeField
                      value={preferredDateTime}
                      onChange={(selection: BookingSelection) => {
                        setPreferredDateTime(selection.display);
                        setPreferredDateTimeUtc(selection.datetimeUtc);
                        setPatientTimezone(selection.timezone);
                        clearFieldError("preferredDateTime");
                      }}
                    />
                  </div>
                  {fe("preferredDateTime") && (
                    <p className="mt-1 text-xs text-red-600">{fe("preferredDateTime")}</p>
                  )}
                </div>

                {/* Consultation Type */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">Consultation Type</label>
                  <div className="mt-2">
                    <ModernSelect
                      name="consultationType"
                      value={consultationType}
                      onChange={setConsultationType}
                      options={consultationOptions}
                      placeholder="None"
                      buttonClassName={fieldBaseClass}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address (optional)"
                    className={cn(fieldBaseClass, "mt-2")}
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message.."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end md:mt-8">
                <PrimaryCTAButton
                  href="#"
                  label="Review & Confirm"
                  size="md"
                  arrowVariant="dark"
                  onClick={(e) => { e.preventDefault(); handleNextStep(); }}
                />
              </div>
            </>
          )}

          {/* ── Step 2: Review ────────────────────────────────────────────── */}
          {step === "review" && (
            <>
              <h2
                id="health-summary-title"
                className="text-balance text-xl font-bold tracking-tight text-gray-900 min-[400px]:text-2xl md:text-[1.75rem] md:leading-snug"
              >
                Your Personalized Health Summary
              </h2>
              <p className="mt-3 max-w-[520px] text-pretty text-sm leading-relaxed text-gray-500 md:text-[15px]">
                Please confirm your details before we recommend your program and
                proceed with booking.
              </p>

              {/* Contact Info card */}
              <div className="mt-6 rounded-tl-[12px] rounded-br-[12px] rounded-tr-[36px] rounded-bl-[36px] border border-gray-100 bg-gray-50 px-4 py-5 md:mt-6 md:rounded-tl-[18px] md:rounded-br-[18px] md:rounded-tr-[78px] md:rounded-bl-[78px] md:px-7 md:py-6">
                <h3 className="text-base font-bold text-black md:text-lg">Contact Info</h3>
                <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3.5 min-[480px]:grid-cols-2 md:mt-5 md:gap-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">Full Name</p>
                    <p className="text-sm font-semibold text-primary md:text-[15px]">{fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">Phone no.</p>
                    <p className="text-sm font-semibold text-primary md:text-[15px]">{phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">Email</p>
                    <p className="text-sm font-semibold text-primary md:text-[15px]">{email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">Preferred Date &amp; Time</p>
                    <p className="text-sm font-semibold text-primary md:text-[15px]">{preferredDateTime}</p>
                  </div>
                  {consultationType && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-black">Consultation type</p>
                      <p className="text-sm font-semibold text-primary md:text-[15px]">{consultationType}</p>
                    </div>
                  )}
                  {address && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-black">Address</p>
                      <p className="text-sm font-semibold text-primary md:text-[15px]">{address}</p>
                    </div>
                  )}
                  {message && (
                    <div className="space-y-1 min-[480px]:col-span-2">
                      <p className="text-sm font-medium text-black">Message</p>
                      <p className="text-sm font-semibold text-primary md:text-[15px]">{message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Details card */}
              <div className="mt-4 rounded-tl-[12px] rounded-br-[12px] rounded-tr-[36px] rounded-bl-[36px] bg-[#E0EFEF] px-4 py-5 md:mt-5 md:rounded-tl-[18px] md:rounded-br-[18px] md:rounded-tr-[78px] md:rounded-bl-[78px] md:px-7 md:py-8">
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

              {submission.kind === "error" && (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submission.message}
                </div>
              )}

              <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:mt-8">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="order-2 w-full min-w-0 shrink-0 rounded-full border border-[#D9D9D9] bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:order-1 sm:flex-1 sm:px-2"
                >
                  Edit Details
                </button>
                <div className="order-1 flex w-full min-w-0 justify-center sm:order-2 sm:w-auto sm:flex-[1.35] sm:justify-end [&>div]:max-w-full sm:[&>div]:max-w-none">
                  <PrimaryCTAButton
                    href="#"
                    label={isSubmitting ? "Booking..." : "Confirm & Book Your Session"}
                    size="md"
                    arrowVariant="dark"
                    disabled={isSubmitting}
                    className="max-sm:w-full max-sm:min-w-0 max-sm:[&>button]:w-full max-sm:[&>button]:justify-center"
                    onClick={(e) => { e.preventDefault(); handleConfirmBook(); }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
