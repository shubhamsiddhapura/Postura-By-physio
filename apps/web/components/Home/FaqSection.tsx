 "use client";

import { useState } from "react";
import { Sparkle, ChevronDown } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

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
    <section id="faqs" className="bg-white py-16 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-10 md:grid-cols-[0.9fr,1.4fr] md:items-start">
          {/* Left copy */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 text-xs justify-center md:justify-start font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkle className="h-4 w-4" />
              <span>You Ask. We Answer.</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Your Questions,
              <br />
              Explained
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
              We believe informed clients recover better. Explore common
              questions about our services, safety, and personalized care
              approach.
            </p>

            <PrimaryCTAButton
              href="#contact"
              label="Still have question?"
              size="sm"
              className="mt-10 hidden md:inline-flex"
            />
          </div>

          {/* Right accordion */}
          <div className="space-y-1">
            {faqs.map((item, index) => {
              const isOpen = index === openIndex;
              return (
                <div
                  key={item.question}
                  className="border-b border-gray-200 last:border-b-0"
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
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
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
              );
            })}
          </div>

          <PrimaryCTAButton
              href="#contact"
              label="Still have question?"
              size="sm"
              className="md:hidden flex justify-center items-center w-40"
            />
        </div>
      </div>
    </section>
  );
}
