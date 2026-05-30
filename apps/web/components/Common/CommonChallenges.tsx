import Image from "next/image";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { FadeIn } from "../ui/FadeIn";
import { CheckCheckIcon } from "lucide-react";

function renderWithBr(value: ReactNode) {
  if (typeof value !== "string") return value;
  const parts = value.split(/<br\s*\/?>/gi);
  if (parts.length === 1) return value;
  return parts.map((part, idx) => (
    <Fragment key={idx}>
      {part}
      {idx < parts.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

export type CommonChallengesImage = {
  src: string;
  alt: string;
};

export type CommonChallengesProps = {
  id?: string;
  backgroundClassName?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Second paragraph below `description`, with extra spacing. */
  description2?: ReactNode;
  /** If omitted or empty, the bullet list is hidden. */
  bullets?: string[];
  image?: CommonChallengesImage;
  watermarkSrc?: string;
  /** Flip the left image horizontally (scaleX(-1)). Same as KeyBenefits `flipImageX` for mirrored layouts. */
  flipImageX?: boolean;
};

export function CommonChallenges({
  id = "common-challenges",
  backgroundClassName = "bg-white",
  eyebrow = "Common Challenges",
  title = "Workplace Health Challenges for IT Professionals",
  description = "Sedentary work routines and repetitive tasks often cause pain, stiffness, and fatigue. Our clinically guided wellness programs help reduce discomfort, improve mobility, and enhance daily performance.",
  description2,
  bullets,
  image = { src: "/it-common-challenges.jpg", alt: "Physiotherapy session" },
  watermarkSrc = "/logo-svg.png",
  flipImageX = false,
}: CommonChallengesProps) {
  const bulletList =
    bullets && bullets.length > 0 ? bullets : null;

  return (
    <section id={id} className={backgroundClassName}>
      <div className="mx-auto max-w-[90vw] py-12 md:px-4 md:py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left image */}
          <FadeIn direction="right" duration={900} distance={60} delay={120}>
            <div className="relative md:mx-auto md:max-w-[480px] lg:mx-0 lg:max-w-none lg:pl-16">
              <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[84px] rounded-br-[84px] rounded-tr-xl bg-gray-100 md:w-full lg:w-[32vw]">
                <div className="relative h-[52vh] w-full md:h-[55vh] lg:h-[68vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={flipImageX ? "object-cover scale-x-[-1]" : "object-cover"}
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Watermark overlay */}
              <div className="pointer-events-none absolute -left-6 bottom-0 md:left-2 lg:left-6">
                <Image
                  src={watermarkSrc}
                  alt="Postura by Physio watermark"
                  width={190}
                  height={320}
                  className="h-auto w-[150px] opacity-60 md:w-[180px] lg:w-[220px]"
                />
              </div>
            </div>
          </FadeIn>

          {/* Right content */}
          <div className="max-w-xl text-center md:mx-auto lg:mx-0 lg:text-left">
            <FadeIn direction="up" duration={800} distance={30} delay={140}>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 lg:justify-start">
                <Image
                  src="/sparkle.svg"
                  alt="Sparkle icon"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="text-primary">{eyebrow}</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={220}>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {renderWithBr(title)}
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={320}>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {renderWithBr(description)}
              </p>
              {description2 ? (
                <p className="mt-5 text-sm leading-6 text-gray-500 md:mt-6">
                  {renderWithBr(description2)}
                </p>
              ) : null}
            </FadeIn>

            {bulletList ? (
              <FadeIn direction="up" duration={800} distance={30} delay={420}>
                <ul className="mt-6 space-y-3 text-left text-sm text-gray-600 md:mt-7">
                  {bulletList.map((b, idx) => (
                    <li key={`${idx}-${b}`} className="flex gap-3">
                      <span
                        className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary"
                        aria-hidden="true"
                      >
                        <CheckCheckIcon className="h-4 w-4 text-white" />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

