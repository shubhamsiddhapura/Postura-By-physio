import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";
import { CheckCheckIcon } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

function CheckBullet({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={[
        "mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
        inverted ? "bg-secondary" : "bg-secondary",
      ].join(" ")}
      aria-hidden="true"
    >
      <CheckCheckIcon className="h-4 w-4 text-white" />
    </span>
  );
}

export function VisionMission() {
  return (
    <section id="vision-mission" className="bg-white">
      <div className="mx-auto max-w-[90vw] py-10 md:px-4 md:py-20 ">
        {/* Header row */}
        <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end text-center md:text-left">
          <FadeIn direction="up" distance={32} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image
                  src="/sparkle.svg"
                  alt="Sparkle icon"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="text-primary">Our Vision &amp; Our Mission</span>
              </div>
              <h2 className="mt-3 md:text-5xl text-3xl font-bold tracking-tight text-gray-900">
                Our Vision for a
                <br />
                Healthier Future
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={120} className="md:justify-self-end">
            <p className="max-w-2xl text-sm leading-6 text-gray-500 md:mt-2">
              We aim to build a healthier community by integrating physiotherapy,
              fitness, and preventive healthcare, empowering individuals to stay
              active, strong, and pain-free at every stage of life.
            </p>
          </FadeIn>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
          <FadeIn direction="up" delay={180}>
            <div className="flex h-full flex-col rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl bg-[#FEF9E0] px-8 py-10">
              <h3 className="text-2xl font-bold text-black text-center md:text-left">Our Vision</h3>

              <ul className="mt-7 flex-1 space-y-5 text-sm leading-6 text-[#6B6B6B]">
                <li className="flex gap-4">
                  <CheckBullet />
                  <span>
                    Lead Vadodara as the top wellness hub integrating aerobics,
                    yoga, Pilates and Physiotherapy
                  </span>
                </li>
                <li className="flex gap-4">
                  <CheckBullet />
                  <span>
                    Revolutionize health for every life stage through seamless
                    fitness-rehab fusion
                  </span>
                </li>
                <li className="flex gap-4">
                  <CheckBullet />
                  <span>
                    Inspire a community prioritizing preventive, joyful movement
                    daily.
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={240}>
            <div className="flex h-full flex-col rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl bg-primary px-8 py-10">
              <h3 className="text-2xl font-bold text-white text-center md:text-left">Our Mission</h3>

              <ul className="mt-7 flex-1 space-y-5 text-sm leading-6 text-white/90">
                <li className="flex gap-4">
                  <CheckBullet inverted />
                  <span>
                    Empower individuals with dynamic, supervised services building
                    endurance, flexibility, strength and resilience.
                  </span>
                </li>
                <li className="flex gap-4">
                  <CheckBullet inverted />
                  <span>
                    Prevent injuries and boost performance for corporate workers,
                    seniors, athletes, pregnancies and communities.
                  </span>
                </li>
                <li className="flex gap-4">
                  <CheckBullet inverted />
                  <span>
                    Enhance quality of life via tailored, evidence based programs
                    fostering long-term vitality.
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="up" delay={320} className="mt-10 flex justify-center">
          <PrimaryCTAButton
            href="/contact-us"
            label="Contact Us"
            size="sm"
            variant="filled"
            arrowVariant="dark"
            className="hover:scale-100"
          />
        </FadeIn>
      </div>
    </section>
  );
}

