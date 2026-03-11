import Image from "next/image";
import { ArrowUpRight, Sparkle } from "lucide-react";

export function MeetPhysiotherapist() {
  return (
    <section id="contact" className="bg-white">
      <div className="py-14 md:py-16">
          <div className="relative overflow-hidden rounded-bl-2xl rounded-tl-[180px] rounded-br-[180px] rounded-tr-2xl bg-primary px-6 py-10 md:px-10 md:py-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr,0.9fr]">
              {/* Left */}
              <div className="text-white pl-20">
                <div className="flex items-center gap-2 text-sm font-medium text-[#FEF9E0] ">
                  <Sparkle className="h-4 w-4" />
                  <span>About Us</span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                  Meet Your Physiotherapist...
                </h2>

                <p className="mt-4 text-xs leading-5 text-white/85 md:text-sm md:leading-6">
                  Postura by Physio is led by Dr. Priyanshi Pandya (PT) BPT,
                  MPT(MAAT), a qualified and registered physiotherapist with
                  strong academic and clinical experience. With a passion for
                  preventive healthcare and functional rehabilitation, she is
                  committed to delivering evidence-based, compassionate, and
                  result-oriented care.
                </p>
                <p className="mt-4 text-xs leading-5 text-white/85 md:text-sm md:leading-6">
                  Her vision is to make quality physiotherapy accessible,
                  reliable, and impactful for every individual.
                </p>

                <div className="mt-8 inline-flex items-center relative group">
                  <a
                    href="#book-session"
                    className="group inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 md:text-sm"
                  >
                    Start Your Recovery Journey
                    
                  </a>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0] absolute -right-3 top-3">
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                </div>
              </div>

              {/* Right */}
              <div className="relative h-[60vh]">
                {/* Watermark SVG behind doctor */}
                <div className="pointer-events-none absolute right-5 -top-12 hidden md:block z-5">
                  <Image
                    src="/white-logo-svg.png"
                    alt=""
                    width={420}
                    height={520}
                    className="h-auto"
                  />
                </div>

<div className="absolute -bottom-28 -right-8 w-[40vw] h-[320px] md:h-[600px]">  
                <Image
                  src="/doctor.png"
                  alt="Physiotherapist"
                  fill
                  priority={false}
                  className="object-contain scale-x-[-1]"
                />
                </div>
              </div>
            </div>

          </div>
      </div>
    </section>
  );
}

