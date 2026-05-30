import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export function TreatmentPhilosophy() {
  return (
    <section id="treatment-philosophy" className="bg-white">
      <div className="mx-auto max-w-[90vw] py-12 md:px-4 md:py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left image */}
          <FadeIn direction="right" duration={900} distance={60} delay={120}>
            <div className="relative md:mx-auto md:max-w-[480px] lg:mx-0 lg:max-w-none lg:pl-16">
              <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[84px] rounded-br-[84px] rounded-tr-xl bg-gray-100 md:w-full lg:w-[32vw]">
                <div className="relative h-[52vh] w-full md:h-[55vh] lg:h-[68vh]">
                  <Image
                    src="/about-1.jpg"
                    alt="Physiotherapy session"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Watermark overlay */}
              <div className="pointer-events-none absolute -left-6 bottom-0 md:left-2 lg:left-6">
                <Image
                  src="/logo-svg.png"
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
            <FadeIn direction="up" duration={800} distance={30} delay={160}>
              <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                Treatment Philosophy
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={260}>
              <p className="mt-4 text-sm leading-6 text-[#6B6B6B]">
                At Postura by Physio, we focus on{" "}
                <span className="font-semibold text-[#6B6B6B]">
                  identifying and treating the root cause                 of pain rather than providing temporary relief.
                </span>{" "}
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={340}>
              <p className="mt-4 text-sm leading-6 text-[#6B6B6B]">
                Our approach combines evidence-based rehabilitation with structured
                fitness programs to restore strength, mobility, and balance. By
                improving overall fitness and correcting underlying issues, we help
                prevent recurring injuries and support long-term wellness.
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={440}>
              <h3 className="mt-10 text-2xl font-bold tracking-tight text-black md:text-3xl">
                Our Commitment
              </h3>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={520}>
              <p className="mt-4 text-sm leading-6 text-[#6B6B6B]">
                We are committed to delivering <span className="font-semibold text-[#6B6B6B]">
                   personalized, high-quality
                physiotherapy and fitness care with compassion and consistency. </span>
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={600}>
              <p className="mt-4 text-sm leading-6 text-[#6B6B6B]">
                Through continuous guidance, education, and scientifically designed
                treatments, we help every individual achieve lasting recovery,
                improved functionality, and long-term well-being.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

