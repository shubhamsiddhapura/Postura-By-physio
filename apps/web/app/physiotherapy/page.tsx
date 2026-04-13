import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { FadeIn } from "@/components/ui/FadeIn";
import Image from "next/image";
import { WhoCanJoin } from "@/components/Home/WhoCanJoin";
import { AdvancedTreatmentCarousel } from "@/components/Physiotherapy/AdvancedTreatmentCarousel";
import { CommonChallenges } from "@/components/Common/CommonChallenges";

export const metadata: Metadata = {
  title: "Physiotherapy Service | Postura by Physio",
  description:
    "Hands-on physiotherapy, guided exercise, and recovery support at home, in your society, or online — personalized plans for pain relief, mobility, and strength.",
};

const physiotherapyServiceSlides = [
  {
    src: "/physiotherapy-hero.png",
    mobileSrc: "/physiotherapy-hero.png",
    alt: "Physiotherapy",
    tag: "Physiotherapy",
    headline: "Expert Physiotherapy<br/> for Pain Relief &<br/> Recovery",
    body:
      "Restore movement, reduce pain, and improve your quality of life with our personalized physiotherapy programs designed for safe and long-term recovery.",
    sub: "",
  },
];

const approachSteps = [
  { key: "01", title: "Assessment", position: "top" as const },
  { key: "02", title: "Identify Root Cause", position: "bottom" as const },
  { key: "03", title: "Targeted Treatment", position: "top" as const },
  { key: "04", title: "Strength Restoration", position: "bottom" as const },
  { key: "05", title: "Long-Term Recovery & Prevention", position: "top" as const },
];

export default function PhysiotherapyServicePage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={physiotherapyServiceSlides} showBookSessionButton id="physiotherapy-service-hero" />

      {/* How it works / approach timeline */}
      <section className="bg-white">
        <div className="mx-auto max-w-[90vw] px-4 pt-16 md:px-4 md:pt-28">
          <div className="flex justify-between md:items-end md:gap-12">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">How it Works</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Our Approach to<br/> Physiotherapy
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100}>
            <div className="space-y-4 text-center text-sm leading-7 text-gray-500 md:text-right">
              <p>
              A structured and progressive rehabilitation process designed for complete<br/> recovery.
              </p>
            </div>
          </FadeIn>
        </div>

          <div className="relative mt-48">
            {/* center dashed line */}
            <div className="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 border-t-4 border-dashed border-[#D9D9D9]" />

            <div className="relative z-10 grid grid-cols-5">
              {approachSteps.map((step, idx) => {
                const isTop = step.position === "top";
                return (
                  <div key={step.key} className="relative flex flex-col items-center">
                    {/* intersection dot */}
                    <div className="absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                    {/* connector */}
                    <div
                      className={[
                        "absolute left-1/2 z-10 w-px -translate-x-1/2 bg-primary",
                        isTop
                          ? "top-[calc(50%-1px)] h-20 -translate-y-full"
                          : "top-[calc(50%+1px)] h-20",
                      ].join(" ")}
                    />

                    {/* end marker (ring dot) */}
                    <div
                      className={[
                        "absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-white",
                        isTop
                          ? "top-[calc(50%-5rem)] -translate-y-1/2"
                          : "top-[calc(50%+5rem)] -translate-y-1/2",
                      ].join(" ")}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>

                    {/* marker + label */}
                    <div
                      className={[
                        "flex flex-col items-center",
                        isTop ? "-translate-y-[8.75rem]" : "translate-y-[8.75rem]",
                      ].join(" ")}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                        {step.key}
                      </div>
                      <div className="mt-3 text-center text-md font-semibold text-slate-900">{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

<div className="mt-40"> 

      <WhoCanJoin
        id="physiotherapy-services"
        eyebrow="Physiotherapy Services"
        title={
          <>
            Our Physiotherapy
            <br />
            Services
          </>
        }
        description="Comprehensive rehabilitation solutions tailored to your condition and recovery goals."
        cards={[
          {
            title: "Orthopedic Rehabilitation",
            subtitle: "Treatment for joint pain, fractures, ligament injuries, and post-surgical recovery",
            imageSrc: "/physio-1.jpg",
          },
          {
            title: "Neurological Rehabilitation",
            subtitle: "Improves mobility, coordination, and functional independence for neurological conditions",
            imageSrc: "/physio-2.jpg",
          },
          {
            title: "Cardio Rehabilitation",
            subtitle: "Enhances lung capacity, breathing efficiency, and endurance",
            imageSrc: "/physio-3.jpg",
          },
          {
            title: "Women’s Physiotherapy",
            subtitle: "Supports pre- and post-natal recovery, pelvic floor strengthening, and overall maternal health",
            imageSrc: "/physio-4.jpg",
          },
          {
            title: "Geriatric Rehabilitation",
            subtitle: "Focuses on balance, mobility, and fall prevention for seniors",
            imageSrc: "/physio-hero.png",
          },
          {
            title: "Postural Correction",
            subtitle: "Designed for corporate and desk-based professionals to reduce pain and improve posture",
            imageSrc: "/physio-yoga.jpg",
          },
        ]}
      />
</div>

      <div className="mt-16">
        <AdvancedTreatmentCarousel
          id="advanced-treatment-techniques"
          items={[
            {
              title: "Cupping Therapy",
              imageSrc: "/physio-1.jpg",
              imageAlt: "Cupping Therapy",
            },
            {
              title: "Manual Therapy",
              imageSrc: "/physio-2.jpg",
              imageAlt: "Manual Therapy",
            },
            {
              title: "Dry Needling",
              imageSrc: "/physio-3.jpg",
              imageAlt: "Dry Needling",
            },
            {
              title: "Functional Training",
              imageSrc: "/physio-4.jpg",
              imageAlt: "Functional Training",
            },
            {
              title: "Flexibar Therapy",
              imageSrc: "/physio-yoga.jpg",
              imageAlt: "Flexibar Therapy",
            },
            {
              title: "Dry Needling",
              imageSrc: "/physio-3.jpg",
              imageAlt: "Dry Needling",
            },
            {
              title: "Functional Training",
              imageSrc: "/physio-4.jpg",
              imageAlt: "Functional Training",
            },
            {
              title: "Flexibar Therapy",
              imageSrc: "/physio-yoga.jpg",
              imageAlt: "Flexibar Therapy",
            },
          ]}
        />
      </div>

      <div className="mt-24 pb-20 bg-white">
        <CommonChallenges
          eyebrow="Benefits"
          title={"Benefits of Physiotherapy"}
          description="Improve your overall physical health and daily performance."
          bullets={[
            "Pain relief and reduced discomfort",
            "Improved mobility and flexibility",
            "Enhanced strength and endurance",
            "Better posture and body alignment",
            "Reduced risk of recurring injuries",
            "Improved quality of life",
          ]}
          image={{ src: "/physio-1.jpg", alt: "Physiotherapy session" }}
        />
      </div>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Start Your Recovery Journey Today"
        ctaDescription="Don’t let pain limit your daily life. Book a physiotherapy session and take the first step towards better movement and long-term wellness."
      />
    </div>
  );
}
