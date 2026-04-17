"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";
import { BookingDateTimeField } from "./BookingDateTimeField";
import {
  clearInteractionAnswers,
  readInteractionAnswers,
} from "../../lib/booking/session";

type ContactBookingSectionProps = {
  className?: string;
};

const WHATSAPP_PHONE = "916354011290";

type ProgramId = "physiotherapy" | "fitness";

const programs: Array<{
  id: ProgramId;
  title: string;
  image: string;
  alt: string;
}> = [
  {
    id: "physiotherapy",
    title: "Physiotherapy Program",
    image: "/book-1.jpg",
    alt: "Physiotherapist with patient",
  },
  {
    id: "fitness",
    title: "Fitness Program",
    image: "/book-2.jpg",
    alt: "Group fitness session",
  },
];

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id: string }
  | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> };

export function ContactBookingSection({ className }: ContactBookingSectionProps) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>("physiotherapy");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });

  // Questionnaire answers stashed by /patient-interaction. Captured once on
  // mount so the user can still edit the booking form without losing context.
  const interactionRef = useRef<ReturnType<typeof readInteractionAnswers>>(null);
  useEffect(() => {
    interactionRef.current = readInteractionAnswers();
  }, []);

  const whatsappHref = useMemo(() => {
    const programLabel =
      selectedProgram === "physiotherapy" ? "Physiotherapy Program" : "Fitness Program";
    const consultation =
      consultationType.trim() === "" ? "None" : consultationType;
    const lines = [
      "Hi! I’d like to book an appointment.",
      "",
      `Program: ${programLabel}`,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Phone: ${phone}` : null,
      email ? `Email: ${email}` : null,
      preferredDateTime ? `Preferred date & time: ${preferredDateTime}` : null,
      `Consultation type: ${consultation}`,
      address ? `Address: ${address}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean) as string[];

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [
    address,
    consultationType,
    email,
    fullName,
    message,
    phone,
    preferredDateTime,
    selectedProgram,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (submission.kind === "submitting") return;

      setSubmission({ kind: "submitting" });

      const interaction = interactionRef.current;
      const payload: Record<string, unknown> = {
        program: selectedProgram,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDateTime: preferredDateTime.trim(),
        consultationType:
          consultationType.trim() === "" ? null : consultationType,
        address: address.trim() === "" ? null : address.trim(),
        message: message.trim() === "" ? null : message.trim(),
        profileAbout: interaction?.about ?? null,
        activityLevel: interaction?.activity ?? null,
        discomfortArea: interaction?.discomfort ?? null,
        possibleCause: interaction?.cause ?? null,
      };

      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          const fieldErrors: Record<string, string[]> | undefined =
            data?.issues?.fieldErrors;
          setSubmission({
            kind: "error",
            message:
              data?.error ??
              "Something went wrong while submitting your booking. Please try again.",
            fieldErrors,
          });
          return;
        }

        clearInteractionAnswers();
        interactionRef.current = null;
        setSubmission({ kind: "success", id: data.data.id });

        // Reset the form so a second booking on the same visit starts clean.
        setFullName("");
        setPhone("");
        setEmail("");
        setPreferredDateTime("");
        setConsultationType("");
        setAddress("");
        setMessage("");
      } catch (err) {
        setSubmission({
          kind: "error",
          message:
            err instanceof Error
              ? err.message
              : "Network error. Please try again.",
        });
      }
    },
    [
      address,
      consultationType,
      email,
      fullName,
      message,
      phone,
      preferredDateTime,
      selectedProgram,
      submission.kind,
    ]
  );

  const fieldError = (field: string): string | undefined =>
    submission.kind === "error"
      ? submission.fieldErrors?.[field]?.[0]
      : undefined;

  const isSubmitting = submission.kind === "submitting";
  const isSuccess = submission.kind === "success";

  const fieldClass =
    "h-11 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary";

  return (
    <section className={`relative bg-white md:py-20 py-10 ${className ?? ""}`}>
      <div className="mx-auto md:w-[90vw] max-w-7xl">
        <div className="p-6 md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-stretch md:gap-12">
            {/* Left: Select service — flex column fills grid cell to match form height */}
            <FadeIn
              className="flex h-full min-h-0 flex-col"
              direction="up"
              duration={800}
              distance={30}
              delay={0}
            >
              <div className="flex min-h-0 flex-1 flex-col text-center md:text-left">
                <FadeIn direction="up" duration={800} distance={22} delay={120}>
                  <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                    Select Your Service
                  </h2>
                </FadeIn>
                <FadeIn direction="up" duration={800} distance={22} delay={200}>
                  <p className="mt-2 text-sm text-gray-500">
                    Pick the program that best matches your health and wellness needs.
                  </p>
                </FadeIn>

                <FadeIn
                  className="mt-6 flex min-h-0 flex-1 flex-col md:mt-8"
                  direction="up"
                  duration={800}
                  distance={22}
                  delay={280}
                >
                  <div className="flex min-h-0 flex-1 flex-col gap-4">
                    {programs.map((program) => {
                      const isSelected = selectedProgram === program.id;
                      return (
                        <button
                          key={program.id}
                          type="button"
                          onClick={() => setSelectedProgram(program.id)}
                          aria-pressed={isSelected}
                          className={cn(
                            "group relative flex w-full flex-col overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl bg-gray-100 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:min-h-0 md:flex-1",
                            isSelected
                              ? "border-2 border-primary p-3 shadow-sm"
                              : "border-2 border-transparent p-0",
                          )}
                        >
                          <div
                            className={cn(
                              "relative aspect-[4/3] w-full overflow-hidden rounded-bl-lg rounded-tl-3xl rounded-br-3xl rounded-tr-lg md:aspect-auto md:min-h-0 md:flex-1",
                            )}
                          >
                            <Image
                              src={program.image}
                              alt={program.alt}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                              sizes="(min-width: 768px) 40vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-black/10" />

                            {isSelected ? (
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            )}

                            <p className="absolute bottom-6 left-6 right-8 z-10 text-base font-semibold text-white font-cabinet md:text-lg">
                              {program.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </FadeIn>
              </div>
            </FadeIn>

            {/* Right: Appointment form */}
            <FadeIn
              className="flex h-full min-h-0 flex-col"
              direction="up"
              duration={800}
              distance={30}
              delay={150}
            >
              <div className="flex h-full min-h-0 flex-col rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] bg-[#fafafa] p-6 md:p-8">
                <FadeIn direction="up" duration={800} distance={22} delay={220}>
                  <h2 className="text-xl font-bold text-gray-900 md:text-3xl">
                    Schedule Your Appointment
                  </h2>
                </FadeIn>
                <FadeIn direction="up" duration={800} distance={22} delay={300}>
                  <p className="mt-2 text-sm text-gray-500">
                    Fill in your details and our team will connect with you to confirm your session.
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={22} delay={380}>
                  <form className="mt-6" onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className={cn(
                            fieldClass,
                            "mt-2",
                            fieldError("fullName") && "border-red-400 focus:border-red-500",
                          )}
                          required
                        />
                        {fieldError("fullName") ? (
                          <p className="mt-1 text-xs text-red-600">{fieldError("fullName")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Phone no.</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder="Enter phone no."
                          className={cn(
                            fieldClass,
                            "mt-2",
                            fieldError("phone") && "border-red-400 focus:border-red-500",
                          )}
                          required
                        />
                        {fieldError("phone") ? (
                          <p className="mt-1 text-xs text-red-600">{fieldError("phone")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Email</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          inputMode="email"
                          type="email"
                          placeholder="Enter email"
                          className={cn(
                            fieldClass,
                            "mt-2",
                            fieldError("email") && "border-red-400 focus:border-red-500",
                          )}
                          required
                        />
                        {fieldError("email") ? (
                          <p className="mt-1 text-xs text-red-600">{fieldError("email")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="preferred-datetime" className="text-sm font-semibold text-gray-800">
                          Preferred Date &amp; Time
                        </label>
                        <div className="mt-2">
                          <BookingDateTimeField
                            id="preferred-datetime"
                            value={preferredDateTime}
                            onChange={setPreferredDateTime}
                          />
                        </div>
                        {fieldError("preferredDateTime") ? (
                          <p className="mt-1 text-xs text-red-600">{fieldError("preferredDateTime")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-800">
                          Consultation Type
                        </label>
                        <div className="relative mt-2">
                          <select
                            value={consultationType}
                            onChange={(e) => setConsultationType(e.target.value)}
                            className={cn(
                              fieldClass,
                              "appearance-none pr-11",
                              consultationType === "" && "text-gray-400",
                            )}
                          >
                            <option value="">None</option>
                            <option value="Home visit">Home visit</option>
                            <option value="Online">Online</option>
                            <option value="Phone">Phone</option>
                            <option value="Society / group">Society / group</option>
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                            aria-hidden
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-800">Address</label>
                        <input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your address (optional)"
                          className={cn(fieldClass, "mt-2")}
                        />
                      </div>

                      <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-800">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Enter your message.."
                          rows={4}
                          className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary"
                        />
                      </div>
                    </div>

                    {submission.kind === "error" ? (
                      <div
                        role="alert"
                        className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {submission.message}
                      </div>
                    ) : null}

                    {isSuccess ? (
                      <div
                        role="status"
                        className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
                      >
                        <p className="font-semibold">Booking received.</p>
                        <p className="mt-0.5 text-primary/80">
                          We&rsquo;ve emailed a copy to you and our team will reach out shortly to
                          confirm your session.
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline sm:text-left"
                      >
                        Prefer WhatsApp? Chat with us instead
                      </a>

                      <div className="flex justify-end">
                        <div className="group relative inline-flex transform items-center transition-transform duration-300 hover:scale-105">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-3 pr-10 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
                          >
                            {isSubmitting
                              ? "Booking..."
                              : isSuccess
                                ? "Book Another"
                                : "Book Appointment"}
                          </button>
                          <span className="absolute -right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0]">
                            <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
