 "use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";
import { scrollToHash } from "../../lib/scroll";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "How do I know which program is right for me?",
    answer:
      "Every client starts with a detailed assessment by our physiotherapist. Based on your posture, pain level, fitness status, and lifestyle, we design a personalized plan that suits your body and goals.",
  },
  {
    question:
      "Can I combine physiotherapy with fitness programs like yoga or aerobics?",
    answer:
      "Yes. We often blend physiotherapy with guided fitness sessions such as yoga, Pilates, or aerobics to help you build strength safely while recovering.",
  },
  {
    question:
      "What makes Postura by Physio different from regular fitness trainers or clinics?",
    answer:
      "We bring evidence-based physiotherapy together with structured movement training, ensuring your sessions are both medically informed and results-driven.",
  },
  {
    question: "Do I need any special equipment at home?",
    answer:
      "Most plans use simple items like a mat, towel, or resistance band. If any additional equipment is recommended, we guide you on affordable, easy-to-use options.",
  },
  {
    question: "Are online sessions suitable for beginners?",
    answer:
      "Absolutely. Sessions are fully guided with live feedback on your posture and movement, making them safe and effective even if you are new to exercise.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="bg-white py-10 overflow-x-hidden">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-10 md:grid-cols-[0.9fr,1.4fr] md:items-start">
          {/* Left copy */}
          <div className="text-center md:text-left">
            <FadeIn direction="up" duration={800} distance={28} delay={0}>
              <div className="flex items-center gap-2 text-xs justify-center md:justify-start font-semibold uppercase tracking-[0.18em] text-primary">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span>You Ask. We Answer.</span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                Your Questions,
                <br />
                Explained
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={28} delay={160}>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
                We believe informed clients recover better. Explore common
                questions about our services, safety, and personalized care
                approach.
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={28} delay={300}>
              <PrimaryCTAButton
                href="#contact"
                label="Still have question?"
                size="sm"
                className="mt-10 hidden md:inline-flex"
                arrowVariant="dark"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#contact", { extraOffsetPx: 12 });
                }}
              />
            </FadeIn>
          </div>

          {/* Right accordion */}
          <div className="space-y-0">
            {faqs.map((item, index) => {
              const isOpen = index === openIndex;
              return (
                <FadeIn key={item.question} direction="left" duration={750} distance={40} delay={100 + index * 110}>
                <div
                  className="border-b border-gray-300"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex((prev) => (prev === index ? -1 : index))
                    }
                    className="flex w-full items-center justify-between gap-4 py-4 text-left md:py-5"
                  >
                    <span className="text-sm font-medium text-gray-900 md:text-base">
                      {item.question}
                    </span>

                    <span className="shrink-0">
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full border shadow-sm transition-colors duration-300 ${
                          isOpen
                            ? "border-primary bg-primary text-white"
                            : "border-secondary bg-secondary text-white"
                        }`}
                      >
                        <span className="relative block h-5 w-5">
                          <Plus
                            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                              isOpen ? "scale-75 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
                            }`}
                            strokeWidth={2.5}
                          />
                          <Minus
                            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                              isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
                            }`}
                            strokeWidth={2.5}
                          />
                        </span>
                      </span>
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden pr-10 text-xs text-gray-500 md:text-sm transition-all duration-300 ${
                      isOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="leading-6">{item.answer}</p>
                  </div>
                </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn direction="up" duration={800} distance={28} delay={350}>
            <PrimaryCTAButton
              href="#contact"
              label="Still have question?"
              size="sm"
              className="md:hidden"
              arrowVariant="dark"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#contact", { extraOffsetPx: 12 });
              }}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
