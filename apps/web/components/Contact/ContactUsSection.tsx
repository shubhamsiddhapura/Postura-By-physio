"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { ModernSelect } from "../ui/ModernSelect";
import { cn } from "../../lib/utils";

const WHATSAPP_PHONE_DISPLAY = "+91 6354011290";
const WHATSAPP_PHONE = "916354011290";
const CONTACT_EMAIL = "posturabyphysio@email.com";
const LOCATION = "Vadodara, Gujarat";
const WEBSITE = "posturabyphysio.com";

type ServiceId = "" | "Physiotherapy" | "Fitness" | "Online Consultation" | "Home Visit";

export function ContactUsSection({ className }: { className?: string }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<ServiceId>("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Partial<Record<"fullName" | "phone" | "email" | "service" | "address" | "message", boolean>>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hi! I’d like to book an assessment.",
      "",
      fullName ? `Name: ${fullName}` : null,
      phone ? `Phone: ${phone}` : null,
      email ? `Email: ${email}` : null,
      service ? `Service: ${service}` : null,
      address ? `Address: ${address}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean) as string[];

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [address, email, fullName, message, phone, service]);

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

  const showError = (key: keyof typeof errors) => attemptedSubmit || Boolean(touched[key]);

  const inputClass = (key: keyof typeof errors) =>
    cn(fieldClass, "mt-2", errors[key] && showError(key) ? "border-red-500 focus:border-red-500" : "");

  return (
    <section className={cn("relative bg-white py-10 md:py-20", className)}>
      <div className="mx-auto w-[92vw] max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <FadeIn direction="up" duration={800} distance={26} delay={0}>
            <div className="rounded-[28px] bg-[#fafafa] p-6 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                Book your assessment today.
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Move better. Recover stronger. Stay pain-free.
              </p>

              <form
                className="mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAttemptedSubmit(true);
                  if (!isValid) return;
                  window.open(whatsappHref, "_blank", "noopener,noreferrer");
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
                      required
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
                      pattern="[0-9]*"
                      placeholder="Enter phone no."
                      className={inputClass("phone")}
                      required
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
                      required
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
                        required
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
                      placeholder="Select pain area"
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

                <div className="mt-10 flex justify-end">
                  <div className="group relative inline-flex transform items-center transition-transform duration-300 hover:scale-105">
                    <button
                      type="submit"
                      disabled={!isValid && attemptedSubmit}
                      className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 pr-11 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 md:text-sm"
                    >
                      Book Appointment
                    </button>
                    <span className="absolute -right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0]">
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={26} delay={120}>
            <div className="pt-2 md:pt-6">
              <h3 className="text-2xl font-bold text-gray-900 md:text-4xl">
                Pain shouldn&rsquo;t be your routine.
              </h3>
              <p className="mt-3 max-w-xl text-sm text-gray-500">
                At Postura by Physio, we deliver expert physiotherapy at your doorstep in
                Vadodara — or guide you online, wherever you are.
              </p>

              <dl className="mt-10 space-y-7">
                <div>
                  <dt className="text-sm font-semibold tracking-wide text-gray-400">Phone no.</dt>
                  <dd className="mt-2 text-lg font-semibold text-gray-900">{WHATSAPP_PHONE_DISPLAY}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold tracking-wide text-gray-400">Email</dt>
                  <dd className="mt-2 text-lg font-semibold text-gray-900">{CONTACT_EMAIL}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold tracking-wide text-gray-400">Location</dt>
                  <dd className="mt-2 text-lg font-semibold text-gray-900">{LOCATION}</dd>
                </div>
                <div>
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
                  <SocialIconButton label="Instagram" href="https://www.instagram.com/postura_by_physio?igsh=MTk0NGNyZ3htY3U1Zg==" icon={Instagram} />
                  <SocialIconButton label="LinkedIn" href="https://www.linkedin.com/in/dr-priyanshi-pandya-pt-b91133217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" icon={Linkedin} />
                  {/* <SocialIconButton label="WhatsApp" href={whatsappHref} icon={MessageCircle} /> */}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
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

