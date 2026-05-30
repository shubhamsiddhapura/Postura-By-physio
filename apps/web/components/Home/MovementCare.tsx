import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

const features = [
  {
    imageSrc: "/Prehabilitation-vector.svg",
    label: "Prehabilitation",
  },
  {
    imageSrc: "/Rehabilitation-vector.svg",
    label: "Rehabilitation",
  },
  {
    imageSrc: "/gym-vector.svg",
    label: "Fitness Integration",
  },
];

export function MovementCare() {
  return (
    <section id="moment-care" className="bg-white">
      <div className="mx-auto max-w-[90vw] md:px-4 py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10">
          {/* Left image */}
          <FadeIn direction="right" duration={900} distance={60} delay={100}>
          <div className="relative md:mx-auto md:max-w-[480px] lg:mx-0 lg:max-w-none lg:pl-20">
            <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[84px] rounded-br-[84px] rounded-tr-xl bg-gray-100 md:w-full lg:w-[30vw]">
              <div className="relative h-[50vh] w-full md:h-[55vh] lg:h-[70vh]">
                <Image
                  src="/care-image.jpg"
                  alt="Physiotherapy care session"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>

            {/* SVG mark beside/over the image (like screenshot) */}
            <div className="pointer-events-none absolute md:left-2 lg:left-10 -left-5 bottom-0">
              <Image
                src="/logo-svg.png"
                alt="Postura by Physio logo"
                width={170}
                height={320}
                className="h-auto md:w-[180px] lg:w-[240px] w-[160px] opacity-50"
              />
            </div>
          </div>
          </FadeIn>

          {/* Right content */}
          <div className="text-center lg:text-left">
            <FadeIn direction="up" duration={800} distance={30} delay={150}>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium text-primary">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span>Prevent. Recover. Perform</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={280}>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
                More Than Treatment.
                <br />
                A Complete Movement
                <br />
                Care System.
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={400}>
              <p className="mt-5 text-sm leading-6 text-gray-500">
                At Postura by Physio, we don&apos;t just treat pain we prevent it.
                Our science-led approach blends physiotherapy with structured
                fitness to support you before injury, during recovery and beyond.
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={510}>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Our approach bridges the gap between prevention and recovery
                ensuring care at every stage of your health journey.
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={620}>
              <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3 sm:gap-x-12 md:justify-items-center lg:justify-items-start">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 aspect-square place-items-center rounded-full bg-primary">
                      <Image
                        src={f.imageSrc}
                        alt={`${f.label} icon`}
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
