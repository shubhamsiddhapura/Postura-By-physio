"use client";

import { FadeIn } from "../ui/FadeIn";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

export function RecoveryResultsBanner() {
  return (
    <section className="bg-white pt-10 md:pb-28 pb-20 overflow-x-hidden">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <FadeIn direction="up" duration={850} distance={26}>
          <div className="w-full bg-secondary px-5 py-10 text-[#FEF9E0] shadow-sm rounded-tl-[60px] rounded-tr-[12px] rounded-br-[60px] rounded-bl-[12px] md:rounded-tl-[90px] md:rounded-tr-[24px] md:rounded-br-[90px] md:rounded-bl-[24px] md:px-12 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row items-center md:justify-between md:gap-8">
              <div className="min-w-0 text-center md:text-left space-y-4">
                <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  Let&apos;s find what bothers you
                </h3>
                <p className="mt-2 max-w-2xl text-[#FEF9E0]/90 leading-6">
                  Postura by Physio blends evidence-based physiotherapy with
                  structured fitness for posture, mobility, and long-term
                  wellness. Answer a few questions about your lifestyle, pain, and
                  goals—we&apos;ll suggest the right program before you book a
                  session.
                </p>
              </div>

              <div className="shrink-0 md:pl-2">
                <PrimaryCTAButton
                  href="/patient-interaction"
                  label="Start Assessment"
                  variant="inverse"
                  size="sm"
                  arrowVariant="dark"
                  className="hover:scale-100"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

