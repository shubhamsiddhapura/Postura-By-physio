import Image from "next/image";
import { Sparkle } from "lucide-react";

const features = [
  {
    imageSrc: "/Prehabilitation-vector.png",
    label: "Prehabilitation",
  },
  {
    imageSrc: "/Rehabilitation-vector.png",
    label: "Rehabilitation",
  },
  {
    imageSrc: "/gym-vector.png",
    label: "Fitness Integration",
  },
];

export function MovementCare() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[90vw] px-4 py-16 md:py-10">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10">
          {/* Left image */}
          <div className="relative pl-20">
            <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[84px] rounded-br-[84px] rounded-tr-xl w-[30vw] bg-gray-100">
              <div className="relative h-[50vh] w-full md:h-[70vh]">
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
            <div className="pointer-events-none absolute left-10 bottom-0 hidden md:block">
              <Image
                src="/logo-svg.png"
                alt=""
                width={170}
                height={320}
                className="h-auto w-[240px] opacity-50"
              />
            </div>
          </div>

          {/* Right content */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkle className="h-4 w-4" />
              <span>Prevent. Recover. Perform</span>
            </div>

            <h2 className="mt-3 text-4xl font-semibold text-gray-900 md:text-5xl">
              More Than Treatment.
              <br />
              A Complete Movement
              <br />
              Care System.
            </h2>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              At Postura by Physio, we don&apos;t just treat pain we prevent it.
              Our science-led approach blends physiotherapy with structured
              fitness to support you before injury, during recovery and beyond.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              Our approach bridges the gap between prevention and recovery
              ensuring care at every stage of your health journey.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-3 sm:gap-x-12">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary">
                    <Image
                      src={f.imageSrc}
                      alt=""
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
          </div>
        </div>
      </div>
    </section>
  );
}

