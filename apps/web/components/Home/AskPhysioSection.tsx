import Image from "next/image";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";

const questions = [
  {
    name: "workType",
    label: "What kind of work are you doing?",
    placeholder:
      "Desk job, household work, sports, long driving — your routine affects posture.",
  },
  {
    name: "workingHours",
    label: "What are your working hours?",
    placeholder: "Long sitting hours may lead to stiffness and fatigue.",
  },
  {
    name: "painLocation",
    label: "Where is your pain located?",
    placeholder: "Neck, back, knees, shoulders, hips?",
  },
  {
    name: "possibleCause",
    label: "What could be the cause?",
    placeholder: "Poor posture, stress, weakness, previous injuries?",
  },
];

export function AskPhysioSection() {
  return (
    <section
      id="book-session"
      className="relative overflow-hidden pb-20 pt-10 md:pb-24 md:pt-20"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/askphysio-image.jpg"
          alt="Physio background"
          fill
          className="object-cover md:rounded-bl-[180px] rounded-bl-[90px] md:rounded-tl-3xl rounded-tl-xl md:rounded-br-3xl rounded-br-xl md:rounded-tr-[180px] rounded-tr-[90px]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent md:rounded-bl-[180px] rounded-bl-[90px] md:rounded-tl-3xl rounded-tl-xl md:rounded-br-3xl rounded-br-xl md:rounded-tr-[180px] rounded-tr-[90px]" />
      </div>

      <div className="mx-auto md:max-w-[80vw] px-4">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          {/* Left contact info cards */}
          <div className="relative h-full w-full">
            <div className="flex h-full w-full flex-col justify-end gap-4 px-2 md:px-10">
              <FadeIn direction="up" duration={800} distance={30} delay={0} className="w-full">
                <div className="max-w-2xl rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg bg-[#FFF6DE]/95 px-6 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.28)] backdrop-blur-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                    Service Area
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#008080]">
                    Doorstep & Society-Based Services Available
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" duration={800} distance={30} delay={130} className="w-full">
                <div className="max-w-full rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg bg-[#FFF6DE] px-6 py-4 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                    Whatsapp / Phone no.
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#008080]">
                    +91 635401290
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" duration={800} distance={30} delay={250} className="w-full">
                <div className="max-w-full rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg bg-[#FFF6DE] px-6 py-4 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#008080]">
                    posturabyphysio@gmail.com
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" duration={800} distance={30} delay={370} className="w-full">
                <div className="max-w-full rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg bg-[#FFF6DE] px-6 py-4 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                    Working Hours
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#008080]">
                    Monday – Saturday
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right question card */}
          <FadeIn direction="left" duration={900} distance={55} delay={150} className="w-full">
          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl   bg-white px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:px-10 md:py-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
                  Ask Your Physio
                </h3>
                <p className="mt-2 text-xs leading-5 text-gray-500 md:text-sm md:leading-6">
                  Quick answers. Expert guidance. Better health decisions.
                </p>
              </div>

              <form className="mt-6 space-y-5 md:space-y-6">
                {questions.map((q, index) => (
                  <div key={q.name} className="space-y-2">
                    <label
                      htmlFor={q.name}
                      className="text-xs font-medium text-gray-900 md:text-sm"
                    >
                      {q.label}
                    </label>
                    {index === questions.length - 1 ? (
                      <textarea
                        id={q.name}
                        name={q.name}
                        rows={3}
                        placeholder={q.placeholder}
                        className="w-full resize-none border-0 border-b border-gray-200 bg-transparent px-0 pb-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:border-primary focus:ring-0 md:text-sm"
                      />
                    ) : (
                      <input
                        id={q.name}
                        name={q.name}
                        type="text"
                        placeholder={q.placeholder}
                        className="w-full border-0 border-b border-gray-200 bg-transparent px-0 pb-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:border-primary focus:ring-0 md:text-sm"
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <PrimaryCTAButton
                    href="#contact"
                    label="Book Consultation"
                    size="sm"
                  />
                </div>
              </form>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
