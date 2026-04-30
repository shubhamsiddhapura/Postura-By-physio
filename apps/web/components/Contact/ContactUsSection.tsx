"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Instagram,
  Linkedin,
  Loader2,
} from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { ModernSelect } from "../ui/ModernSelect";
import { cn } from "../../lib/utils";

const WHATSAPP_PHONE_DISPLAY = "+91 6354011290";
const CONTACT_PHONE_TEL = "+916354011290";
const CONTACT_EMAIL = "posturabyphysio@email.com";
const LOCATION = "Vadodara, Gujarat";
const WEBSITE = "posturabyphysio.com";

type ServiceId = "" | "Physiotherapy" | "Fitness" | "Online Consultation" | "Home Visit";
type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactUsSection({ className }: { className?: string }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<ServiceId>("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<"fullName" | "phone" | "email" | "service", boolean>>
  >({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fieldClass =
    "h-11 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary";

  const serviceOptions = useMemo(
    () =>
      [
        { value: "", label: "Select Service", disabled: true },
        { value: "Physiotherapy", label: "Physiotherapy" },
        { value: "Fitness", label: "Fitness" },
        { value: "Online Consultation", label: "Online Consultation" },
        { value: "Home Visit", label: "Home Visit" },
      ] satisfies Array<{ value: ServiceId; label: string; disabled?: boolean }>,
    [],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<"fullName" | "phone" | "email" | "service", string>> = {};
    const name = fullName.trim();
    const mail = email.trim();
    const digits = phone.replace(/\D/g, "");

    if (!name) e.fullName = "Full name is required.";
    else if (name.length < 2) e.fullName = "Please enter your full name.";

    if (!digits) e.phone = "Phone number is required.";
    else if (digits.length < 10) e.phone = "Please enter a valid phone number (10 digits).";

    if (!mail) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) e.email = "Please enter a valid email address.";

    if (!service) e.service = "Please select a service.";

    return e;
  }, [email, fullName, phone, service]);

  const isValid = Object.keys(errors).length === 0;

  const showError = (key: keyof typeof errors) =>
    attemptedSubmit || Boolean(touched[key]);

  const inputClass = (key: keyof typeof errors) =>
    cn(
      fieldClass,
      "mt-2",
      errors[key] && showError(key) ? "border-red-500 focus:border-red-500" : "",
    );

  async function submitContact() {
    if (submitState === "loading") return;

    setAttemptedSubmit(true);
    if (!isValid) return;

    setSubmitState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          service: service || undefined,
          address: address.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (submitState === "success") {
    return (
      <section className={cn("relative bg-white py-10 md:py-20", className)}>
        <div className="mx-auto w-[92vw] max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
            <FadeIn direction="up" duration={800} distance={26} delay={0}>
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] bg-[#fafafa] p-6 text-center md:p-10">
                <CheckCircle2 className="mb-4 h-14 w-14 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Message sent!
                </h2>
                <p className="mt-3 max-w-sm text-sm text-gray-500">
                  Thanks for reaching out. We&rsquo;ve sent a confirmation to your email
                  and the doctor has been notified. We&rsquo;ll get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitState("idle");
                    setAttemptedSubmit(false);
                    setFullName("");
                    setPhone("");
                    setEmail("");
                    setService("");
                    setAddress("");
                    setMessage("");
                    setTouched({});
                  }}
                  className="mt-8 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Send another message
                </button>
              </div>
            </FadeIn>

            <ContactInfo />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("relative bg-white py-10 md:py-20", className)}>
      <div className="mx-auto w-[92vw] max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <FadeIn direction="up" duration={800} distance={26} delay={0}>
            <div className="rounded-[28px] bg-[#fafafa] p-6 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                Contact Us Today
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Move better. Recover stronger. Stay pain-free.
              </p>

              <form
                className="mt-8"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitContact();
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-800">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                      placeholder="Enter full name"
                      className={inputClass("fullName")}
                      aria-invalid={Boolean(errors.fullName) && showError("fullName")}
                    />
                    {errors.fullName && showError("fullName") ? (
                      <p className="mt-1 text-xs font-medium text-red-600">{errors.fullName}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Phone no.</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      inputMode="tel"
                      placeholder="Enter phone no."
                      className={inputClass("phone")}
                      aria-invalid={Boolean(errors.phone) && showError("phone")}
                    />
                    {errors.phone && showError("phone") ? (
                      <p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      inputMode="email"
                      type="email"
                      placeholder="Enter email"
                      className={inputClass("email")}
                      aria-invalid={Boolean(errors.email) && showError("email")}
                    />
                    {errors.email && showError("email") ? (
                      <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Service</label>
                    <div className="mt-2">
                      <ModernSelect<ServiceId>
                        name="service"
                        value={service}
                        onChange={(v) => {
                          setService(v);
                          setTouched((t) => ({ ...t, service: true }));
                        }}
                        options={serviceOptions}
                        placeholder="Select Service"
                        buttonClassName={cn(
                          fieldClass,
                          errors.service && showError("service")
                            ? "border-red-500 focus:border-red-500"
                            : "",
                        )}
                      />
                    </div>
                    {errors.service && showError("service") ? (
                      <p className="mt-1 text-xs font-medium text-red-600">{errors.service}</p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-800">Address</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                      placeholder="Your Address (Optional)"
                      className={cn(fieldClass, "mt-2")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-800">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                      placeholder="Enter your message.."
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary"
                    />
                  </div>
                </div>

                {submitState === "error" && errorMsg ? (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {errorMsg}
                  </p>
                ) : null}

                <div className="mt-10 flex justify-end">
                  <div className="group relative inline-flex transform items-center transition-transform duration-300 hover:scale-105">
                    <button
                      type="button"
                      onClick={() => void submitContact()}
                      disabled={submitState === "loading"}
                      className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 pr-11 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 disabled:opacity-60 md:text-sm"
                    >
                      {submitState === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Contact Us"
                      )}
                    </button>
                    <span className="absolute -right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0]">
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </FadeIn>

          <ContactInfo />
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <FadeIn direction="up" duration={800} distance={26} delay={120}>
      <div className="pt-2 md:pt-6">
        <h3 className="text-2xl font-bold text-gray-900 md:text-4xl">
          Pain shouldn&rsquo;t be your routine.
        </h3>
        <p className="mt-3 max-w-xl text-sm text-gray-500">
          At Postura by Physio, we deliver expert physiotherapy at your doorstep in
          Vadodara — or guide you online, wherever you are.
        </p>

        <dl className="mt-10 divide-y divide-gray-200/70 md:divide-y-0">
          <div className="py-6 first:pt-0 md:py-0">
            <dt className="text-sm font-semibold tracking-wide text-gray-400">Phone no.</dt>
            <dd className="mt-2">
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="text-lg font-semibold text-gray-900 transition hover:text-primary"
              >
                {WHATSAPP_PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div className="py-6 md:py-0">
            <dt className="text-sm font-semibold tracking-wide text-gray-400">Email</dt>
            <dd className="mt-2 text-lg font-semibold text-gray-900">{CONTACT_EMAIL}</dd>
          </div>
          <div className="py-6 md:py-0">
            <dt className="text-sm font-semibold tracking-wide text-gray-400">Location</dt>
            <dd className="mt-2 text-lg font-semibold text-gray-900">{LOCATION}</dd>
          </div>
          <div className="py-6 last:pb-0 md:py-0">
            <dt className="text-sm font-semibold tracking-wide text-gray-400">Website</dt>
            <dd className="mt-2 text-lg font-semibold text-primary underline-offset-4 hover:underline">
              <a href={`https://${WEBSITE}`} target="_blank" rel="noreferrer noopener">
                {WEBSITE}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-10 h-px w-full bg-gray-200/70" />

        <div className="mt-8">
          <p className="text-xs font-semibold tracking-wide text-gray-400">Social Media</p>
          <div className="mt-4 flex items-center gap-3">
            <SocialIconButton
              label="Instagram"
              href="https://www.instagram.com/postura_by_physio?igsh=MTk0NGNyZ3htY3U1Zg=="
              icon={Instagram}
            />
            <SocialIconButton
              label="LinkedIn"
              href="https://www.linkedin.com/in/dr-priyanshi-pandya-pt-b91133217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              icon={Linkedin}
            />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function SocialIconButton({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full border border-primary/60 text-primary transition",
        "hover:bg-primary hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
