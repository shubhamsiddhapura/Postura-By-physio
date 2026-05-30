import Image from "next/image";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";

export type MeetPhysiotherapistProps = {
  eyebrow?: string;
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  ctaLabel?: string;
  /** Digits only, include country code (example: "916354011290"). */
  whatsappPhone?: string;
  /** WhatsApp prefilled message for the CTA. */
  whatsappMessage?: string;
};

export function MeetPhysiotherapist({
  eyebrow = "About Us",
  heading = "Meet Your Physiotherapist...",
  paragraph1 = `Postura by Physio is led by Dr. Priyanshi Pandya (PT) MPT in cardiopulmonary conditions,MIAFT a qualified and NCAHP registered physiotherapist with strong academic and clinical experience. With a passion for preventive healthcare and functional rehabilitation, she is committed to delivering evidence-based, compassionate, and result-oriented care.`,
  paragraph2 = `Her vision is to make quality physiotherapy accessible, reliable, and impactful for every individual.`,
  paragraph3 = ``,
  ctaLabel = "Start Your Recovery Journey",
  whatsappPhone = "916354011290",
  whatsappMessage = "Hi! I’d like to start my recovery journey and book a session.",
}: MeetPhysiotherapistProps) {
  /** Matches home copy `Dr. Priyanshi Pandya (PT)` and about copy `Dr. Priyanshi Pandya(PT)`. */
  const doctorNameSplit = /(Dr\.\s*Priyanshi\s+Pandya\s*\(PT\))/g;
  const isDoctorNameChunk = (s: string) =>
    /^Dr\.\s*Priyanshi\s+Pandya\s*\(PT\)$/.test(s);
  const paragraph1Parts = paragraph1.split(doctorNameSplit);

  return (
    <section id="about" className="bg-white">
      <div className="py-10 md:py-16">
          <div className="relative overflow-hidden md:h-auto rounded-bl-xl md:rounded-tl-[180px] rounded-tl-[90px] md:rounded-br-[180px] rounded-br-[90px] md:rounded-tr-2xl rounded-tr-xl bg-primary px-6 pt-10 md:px-10 md:pt-12 lg:pb-12">
            <div className="grid items-start lg:items-center gap-8 lg:gap-10 lg:grid-cols-[1.1fr,0.9fr]">
              {/* Left */}
              <div className="text-white lg:pl-20 text-center lg:text-left">
                <FadeIn direction="up" duration={800} distance={28} delay={100}>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#FEF9E0] justify-center lg:justify-start ">
                    <Image src="/white-sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                    <span>{eyebrow}</span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={230}>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                    {heading}
                  </h2>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={370}>
                  <p className="mt-4 text-sm leading-5 text-white/85 md:text-sm md:leading-6">
                    {paragraph1Parts.map((part, i) =>
                      isDoctorNameChunk(part) ? (
                        <strong key={i} className="font-bold text-[#FEF9E0]">
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={490}>
                  <p className="mt-4 text-xs leading-5 text-white/85 md:text-sm md:leading-6">
                    {paragraph2}
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={490}>
                  <p className="mt-4 text-xs leading-5 text-white/85 md:text-sm md:leading-6">
                    {paragraph3}
                  </p>
                </FadeIn>

                <FadeIn direction="up" duration={800} distance={28} delay={600}>
                  <PrimaryCTAButton
                    href={`/patient-interaction`}
                    label={ctaLabel}
                    size="sm"
                    className="mt-8 text-[#FEF9E0]"  
                  />
                </FadeIn>
              </div>

              {/* Right */}
              <FadeIn direction="left" duration={900} distance={60} delay={200}>
              <div className="relative h-[350px] md:h-[400px] lg:h-[450px]">
                {/* Watermark SVG behind doctor */}
                <div className="pointer-events-none absolute lg:right-5 -top-12 -right-10 z-5">
                  <Image
                    src="/white-logo-svg.png"
                    alt="Postura by Physio watermark"
                    width={420}
                    height={520}
                    className="h-auto"
                  />
                </div>

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[80%] h-[110%] lg:left-auto lg:translate-x-0 lg:-bottom-32 lg:-right-8 lg:w-[40vw] lg:h-[600px]">
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
