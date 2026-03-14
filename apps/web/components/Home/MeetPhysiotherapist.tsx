import Image from "next/image";
import { Sparkle } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";

export function MeetPhysiotherapist() {
  return (
    <section id="contact" className="bg-white">
      <div className="py-10 md:py-16">
          <div className="relative overflow-hidden rounded-bl-xl md:rounded-tl-[180px] rounded-tl-[90px] md:rounded-br-[180px] rounded-br-[90px] md:rounded-tr-2xl rounded-tr-xl bg-primary px-6 py-10 md:px-10 md:py-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr,0.9fr]">
              {/* Left */}
              <div className="text-white md:pl-20 text-center md:text-left">
                <FadeIn direction="up" duration={800} distance={28} delay={100}>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#FEF9E0] justify-center md:justify-start ">
                    <Sparkle className="h-4 w-4" />
                    <span>About Us</span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={230}>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                    Meet Your Physiotherapist...
                  </h2>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={370}>
                  <p className="mt-4 text-sm leading-5 text-white/85 md:text-sm md:leading-6">
                    Postura by Physio is led by <span className="font-bold text-[#FEF9E0]">Dr. Priyanshi Pandya (PT) </span> BPT,
                    MPT(MAAT), a qualified and registered physiotherapist with
                    strong academic and clinical experience. With a passion for
                    preventive healthcare and functional rehabilitation, she is
                    committed to delivering evidence-based, compassionate, and
                    result-oriented care.
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={490}>
                  <p className="mt-4 text-xs leading-5 text-white/85 md:text-sm md:leading-6">
                    Her vision is to make quality physiotherapy accessible,
                    reliable, and impactful for every individual.
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={600}>
                  <PrimaryCTAButton
                    href="#book-session"
                    label="Start Your Recovery Journey"
                    size="sm"
                    className="mt-8"  
                  />
                </FadeIn>
              </div>

              {/* Right */}
              <FadeIn direction="left" duration={900} distance={60} delay={200}>
              <div className="relative h-[60vh]">
                {/* Watermark SVG behind doctor */}
                <div className="pointer-events-none absolute right-5 -top-12 z-5">
                  <Image
                    src="/white-logo-svg.png"
                    alt=""
                    width={420}
                    height={520}
                    className="h-auto"
                  />
                </div>

<div className="absolute md:-bottom-28 -bottom-16 md:-right-8 right-0 md:w-[40vw] w-full h-full md:h-[600px]">  
                <Image
                  src="/doctor.png"
                  alt="Physiotherapist"
                  fill
                  priority={false}
                  className="object-contain scale-x-[-1]"
                />
                </div>
              </div>
              </FadeIn>
            </div>

          </div>
      </div>
    </section>
  );
}
