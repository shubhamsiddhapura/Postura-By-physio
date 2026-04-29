"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";
import { BookingDateTimeField, type BookingSelection } from "./BookingDateTimeField";
import { ModernSelect } from "../ui/ModernSelect";
import { BOOKING_SERVICES, PAIN_AREAS } from "@repo/types";
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
  | { kind: "error"; message: string };

export function ContactBookingSection({ className }: ContactBookingSectionProps) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>("physiotherapy");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  // Canonical UTC + patient's IANA timezone, captured the moment the user
  // picks a slot in `BookingDateTimeField`. Both are required on POST, so
  // when either is missing the submit button will surface a field error.
  const [preferredDateTimeUtc, setPreferredDateTimeUtc] = useState<string | null>(null);
  const [patientTimezone, setPatientTimezone] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState("");
  const [service, setService] = useState("");
  // Pain area picked directly on the booking form. If the user arrived from
  // /patient-interaction we pre-fill this with their questionnaire answer
  // so they don't have to re-pick, but they can still change it.
  const [painArea, setPainArea] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [touched, setTouched] = useState<
    Partial<
      Record<
        | "fullName"
        | "phone"
        | "email"
        | "preferredDateTime"
        | "consultationType"
        | "service"
        | "painArea"
        | "address"
        | "message",
        boolean
      >
    >
  >({});

  // Questionnaire answers stashed by /patient-interaction. Captured once on
  // mount so the user can still edit the booking form without losing context.
  const interactionRef = useRef<ReturnType<typeof readInteractionAnswers>>(null);
  useEffect(() => {
    const stored = readInteractionAnswers();
    interactionRef.current = stored;
    if (stored?.discomfort) setPainArea(stored.discomfort);
  }, []);

  const whatsappHref = useMemo(() => {
    const programLabel =
      selectedProgram === "physiotherapy" ? "Physiotherapy Program" : "Fitness Program";
    const consultation = consultationType.trim();
    const lines = [
      "Hi! I’d like to book an appointment.",
      "",
      `Program: ${programLabel}`,
      service ? `Service: ${service}` : null,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Phone: ${phone}` : null,
      email ? `Email: ${email}` : null,
      preferredDateTime ? `Preferred date & time: ${preferredDateTime}` : null,
      consultation ? `Consultation type: ${consultation}` : null,
      painArea ? `Pain area: ${painArea}` : null,
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
    painArea,
    phone,
    preferredDateTime,
    selectedProgram,
    service,
  ]);

  const clientErrors = useMemo(() => {
    const e: Partial<
      Record<
        | "fullName"
        | "phone"
        | "email"
        | "preferredDateTime"
        | "consultationType"
        | "service"
        | "painArea"
        | "address",
        string
      >
    > = {};
    const name = fullName.trim();
    const digits = phone.replace(/\D/g, "");
    const mail = email.trim();
    const consult = consultationType.trim();
    const svc = service.trim();
    const pain = painArea.trim();
    const addr = address.trim();

    if (!name) e.fullName = "Please enter your full name.";
    if (!digits) e.phone = "Please enter your phone number.";
    else if (digits.length < 10) e.phone = "Please enter a valid phone number.";
    if (!mail) e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      e.email = "Please enter a valid email address.";
    if (!preferredDateTimeUtc || !patientTimezone)
      e.preferredDateTime = "Please choose a date and time.";
    if (!consult) e.consultationType = "Please select a consultation type.";
    if (!svc) e.service = "Please select a service.";
    if (!pain) e.painArea = "Please select a pain area.";
    if (!addr) e.address = "Please enter your address.";

    return e;
  }, [
    address,
    consultationType,
    email,
    fullName,
    painArea,
    patientTimezone,
    phone,
    preferredDateTimeUtc,
    service,
  ]);

  const showClientError = useCallback(
    (key: keyof typeof clientErrors) =>
      submission.kind !== "success" && (attemptedSubmit || Boolean(touched[key])),
    [attemptedSubmit, touched],
  );

  const clientFieldError = useCallback(
    (key: keyof typeof clientErrors) =>
      clientErrors[key] && showClientError(key) ? clientErrors[key] : undefined,
    [clientErrors, showClientError],
  );

  const isClientValid = Object.keys(clientErrors).length === 0;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (submission.kind === "submitting") return;

      setAttemptedSubmit(true);
      // Frontend validations — do not POST until valid
      if (!isClientValid) {
        setSubmission({ kind: "idle" });
        return;
      }

      setSubmission({ kind: "submitting" });

      const interaction = interactionRef.current;
      // preferredDateTimeUtc/patientTimezone validated above (clientErrors)

      const trimmedPainArea = painArea.trim();
      const trimmedService = service.trim();
      const payload: Record<string, unknown> = {
        program: selectedProgram,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDateTime: preferredDateTime.trim(),
        preferredDateTimeUtc,
        patientTimezone,
        consultationType:
          consultationType.trim() === "" ? null : consultationType,
        service: trimmedService === "" ? null : trimmedService,
        address: address.trim() === "" ? null : address.trim(),
        message: message.trim() === "" ? null : message.trim(),
        profileAbout: interaction?.about ?? null,
        activityLevel: interaction?.activity ?? null,
        // Pain area picked on the form wins over the questionnaire answer,
        // but fall back to the questionnaire if the user never touched it.
        discomfortArea:
          trimmedPainArea !== ""
            ? trimmedPainArea
            : interaction?.discomfort ?? null,
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
          setSubmission({
            kind: "error",
            message:
              data?.error ??
              "Something went wrong while submitting your booking. Please try again.",
          });
          return;
        }

        clearInteractionAnswers();
        interactionRef.current = null;
        setSubmission({ kind: "success", id: data.data.id });

        // Reset the form so a second booking on the same visit starts clean.
        setAttemptedSubmit(false);
        setTouched({});
        setFullName("");
        setPhone("");
        setEmail("");
        setPreferredDateTime("");
        setPreferredDateTimeUtc(null);
        setPatientTimezone(null);
        setConsultationType("");
        setService("");
        setPainArea("");
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
      isClientValid,
      message,
      painArea,
      patientTimezone,
      phone,
      preferredDateTime,
      preferredDateTimeUtc,
      selectedProgram,
      service,
      submission.kind,
    ]
  );

  const isSubmitting = submission.kind === "submitting";
  const isSuccess = submission.kind === "success";

  const fieldClass =
    "h-11 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary";

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

  const serviceOptions = useMemo(
    () => [
      { value: "", label: "Select service (optional)" },
      ...BOOKING_SERVICES.map((s) => ({ value: s, label: s })),
    ],
    [],
  );

  const painAreaOptions = useMemo(
    () => [
      { value: "", label: "Select pain area (optional)" },
      ...PAIN_AREAS.map((p) => ({ value: p, label: p })),
    ],
    [],
  );

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
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setTouched((t) => ({ ...t, fullName: true }));
                          }}
                          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                          placeholder="Enter full name"
                          className={cn(
                            fieldClass,
                            "mt-2",
                            clientFieldError("fullName") && "border-red-400 focus:border-red-500",
                          )}
                          required
                          aria-invalid={Boolean(clientFieldError("fullName"))}
                        />
                        {clientFieldError("fullName") ? (
                          <p className="mt-1 text-xs text-red-600">{clientFieldError("fullName")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Phone no.</label>
                        <input
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, ""));
                            setTouched((t) => ({ ...t, phone: true }));
                          }}
                          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                          inputMode="tel"
                          pattern="[0-9]*"
                          placeholder="Enter phone no."
                          className={cn(
                            fieldClass,
                            "mt-2",
                            clientFieldError("phone") && "border-red-400 focus:border-red-500",
                          )}
                          required
                          aria-invalid={Boolean(clientFieldError("phone"))}
                        />
                        {clientFieldError("phone") ? (
                          <p className="mt-1 text-xs text-red-600">{clientFieldError("phone")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Email</label>
                        <input
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setTouched((t) => ({ ...t, email: true }));
                          }}
                          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                          inputMode="email"
                          type="email"
                          placeholder="Enter email"
                          className={cn(
                            fieldClass,
                            "mt-2",
                            clientFieldError("email") && "border-red-400 focus:border-red-500",
                          )}
                          required
                          aria-invalid={Boolean(clientFieldError("email"))}
                        />
                        {clientFieldError("email") ? (
                          <p className="mt-1 text-xs text-red-600">{clientFieldError("email")}</p>
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
                            onChange={(selection: BookingSelection) => {
                              setPreferredDateTime(selection.display);
                              setPreferredDateTimeUtc(selection.datetimeUtc);
                              setPatientTimezone(selection.timezone);
                              setTouched((t) => ({ ...t, preferredDateTime: true }));
                            }}
                          />
                        </div>
                        {clientFieldError("preferredDateTime") ? (
                          <p className="mt-1 text-xs text-red-600">{clientFieldError("preferredDateTime")}</p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">
                          Consultation Type
                        </label>
                        <div className="mt-2">
                          <ModernSelect
                            name="consultationType"
                            value={consultationType}
                            onChange={(v) => {
                              setConsultationType(v);
                              setTouched((t) => ({ ...t, consultationType: true }));
                            }}
                            options={consultationOptions}
                            placeholder="None"
                            required
                            buttonClassName={cn(
                              fieldClass,
                              clientFieldError("consultationType") &&
                                "border-red-400 focus:border-red-500",
                            )}
                          />
                        </div>
                        {clientFieldError("consultationType") ? (
                          <p className="mt-1 text-xs text-red-600">
                            {clientFieldError("consultationType")}
                          </p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Service</label>
                        <div className="mt-2">
                          <ModernSelect
                            name="service"
                            value={service}
                            onChange={(v) => {
                              setService(v);
                              setTouched((t) => ({ ...t, service: true }));
                            }}
                            options={serviceOptions}
                            placeholder="Select service (optional)"
                            required
                            buttonClassName={cn(
                              fieldClass,
                              clientFieldError("service") &&
                                "border-red-400 focus:border-red-500",
                            )}
                          />
                        </div>
                        {clientFieldError("service") ? (
                          <p className="mt-1 text-xs text-red-600">
                            {clientFieldError("service")}
                          </p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Pain Area</label>
                        <div className="mt-2">
                          <ModernSelect
                            name="painArea"
                            value={painArea}
                            onChange={(v) => {
                              setPainArea(v);
                              setTouched((t) => ({ ...t, painArea: true }));
                            }}
                            options={painAreaOptions}
                            placeholder="Select pain area (optional)"
                            required
                            buttonClassName={cn(
                              fieldClass,
                              clientFieldError("painArea") &&
                                "border-red-400 focus:border-red-500",
                            )}
                          />
                        </div>
                        {clientFieldError("painArea") ? (
                          <p className="mt-1 text-xs text-red-600">
                            {clientFieldError("painArea")}
                          </p>
                        ) : null}
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Address</label>
                        <input
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            setTouched((t) => ({ ...t, address: true }));
                          }}
                          onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                          placeholder="Enter your address"
                          className={cn(
                            fieldClass,
                            "mt-2",
                            clientFieldError("address") &&
                              "border-red-400 focus:border-red-500",
                          )}
                          required
                          aria-invalid={Boolean(clientFieldError("address"))}
                        />
                        {clientFieldError("address") ? (
                          <p className="mt-1 text-xs text-red-600">
                            {clientFieldError("address")}
                          </p>
                        ) : null}
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
