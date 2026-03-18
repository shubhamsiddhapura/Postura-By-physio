import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";
import { CheckCheckIcon } from "lucide-react";

export type KeyBenefitsImage = {
  src: string;
  alt: string;
};

export type KeyBenefitsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  image?: KeyBenefitsImage;
  watermarkSrc?: string;
  /** Flip the right image horizontally (scaleX(-1)). Useful when mirroring design directions. */
  flipImageX?: boolean;
};

export function KeyBenefits({
  eyebrow = "Key Benefit’s",
  title = "Workplace Wellness Benefits",
  description = "From pain relief and posture improvement to increased energy and focus, our programs help corporate professionals stay healthier, more active, and more productive at work.",
  bullets = [
    "Reduced neck, shoulder, and back pain",
    "Improved posture and workplace ergonomics",
    "Increased stamina and daily work endurance",
    "Better concentration, productivity, and job performance",
    "Lower risk of lifestyle disorders and repetitive strain injuries",
    "Enhanced team bonding through group wellness sessions",
  ],
  image = { src: "/it-key-benefits.jpg", alt: "Workplace wellness session" },
  watermarkSrc = "/logo-svg.png",
  flipImageX = false,
}: KeyBenefitsProps) {
  return (
    <section id="key-benefits" className="bg-white">
      <div className="mx-auto max-w-[90vw] py-12 md:px-4 md:py-10">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Left content */}
          <div className="max-w-xl text-center md:text-left">
            <FadeIn direction="up" duration={800} distance={30} delay={140}>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                <Image
                  src="/sparkle.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="text-primary">{eyebrow}</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={220}>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {title}
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={320}>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={420}>
              <ul className="mt-6 space-y-3 text-left text-sm text-gray-600 md:mt-7">
                {bullets.map((b, idx) => (
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
          </div>

          {/* Right image */}
          <FadeIn direction="left" duration={900} distance={60} delay={120}>
            <div className="relative md:pr-16">
              <div className="relative overflow-hidden rounded-tr-[84px] rounded-tl-xl rounded-br-xl rounded-bl-[84px] bg-gray-100 md:ml-auto md:w-[32vw]">
                <div className="relative h-[52vh] w-full md:h-[68vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={flipImageX ? "object-cover scale-x-[-1]" : "object-cover"}
                    sizes="(min-width: 768px) 40vw, 90vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Watermark overlay */}
              <div className="pointer-events-none absolute -left-5 md:left-10 bottom-0">
                <Image
                  src={watermarkSrc}
                  alt=""
                  width={190}
                  height={320}
                  className="h-auto w-[150px] opacity-60 md:w-[220px]"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

