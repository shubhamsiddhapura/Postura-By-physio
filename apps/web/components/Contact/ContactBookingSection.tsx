"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";
import { BookingDateTimeField } from "./BookingDateTimeField";

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

export function ContactBookingSection({ className }: ContactBookingSectionProps) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>("physiotherapy");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

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
              <div className="flex min-h-0 flex-1 flex-col">
                <FadeIn direction="up" duration={800} distance={22} delay={120}>
                  <h2 className="text-xl font-bold text-gray-900 md:text-4xl">
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
                  <form
                    className="mt-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.open(whatsappHref, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className={cn(fieldClass, "mt-2")}
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Phone no.</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder="Enter phone no."
                          className={cn(fieldClass, "mt-2")}
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-800">Email</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          inputMode="email"
                          placeholder="Enter email"
                          className={cn(fieldClass, "mt-2")}
                        />
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
                          placeholder="Select pain area"
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

                    <div className="mt-10 flex justify-end">
                      <div className="group relative inline-flex transform items-center transition-transform duration-300 hover:scale-105">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-3 pr-10 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 md:text-sm"
                        >
                          Book Appointment
                        </button>
                        <span className="absolute -right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0]">
                          <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
                        </span>
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
