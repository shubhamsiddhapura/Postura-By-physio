import Image from "next/image";
import { Sparkle } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";

const services = [
  {
    title: "Aerobics",
    description:
      "Fun, rhythmic workouts designed to boost heart health and endurance—safe for all fitness levels.",
    imageSrc: "/aerobics.png",
    tags: ["Weight loss", "Stamina", "Energy"],
    imageWrapperClass:
      "h-40 md:-bottom-36 -bottom-20 md:right-0 right-14 w-full max-w-[220px] md:h-full h-72 md:max-w-full",
    iconSrc: "/aerobics-icon.png",
  },
  {
    title: "Pilates",
    description:
      "Controlled movements that strengthen your core and correct posture safely.",
    imageSrc: "/Pilates.png",
    tags: ["Core", "Posture", "Injury Prevention"],
    imageWrapperClass:
      "h-40 md:-bottom-20 right-10 w-full max-w-[260px] md:h-full md:max-w-full",
    iconSrc: "/plates-icon.png",
  },
  {
    title: "Yoga",
    description:
      "Structured yoga & power yoga sessions for strength, calm, and mobility.",
    imageSrc: "/yoga.png",
    tags: ["Stress", "Flexibility", "Balance"],
    imageWrapperClass:
      "md:-bottom-40 -bottom-16 md:right-0 right-14 w-full max-w-[220px] md:h-full h-72 md:max-w-full",
    iconSrc: "/yoga-icon.png",
  },
  {
    title: "Physiotherapy",
    description:
      "Personalized rehab programs using advanced techniques like dry needling & cupping.",
    imageSrc: "/Physiotherapy.png",
    tags: ["Pain", "Recovery", "Mobility"],
    imageWrapperClass:
      "h-96 md:top-0 top-28 md:right-0 right-10 w-full max-w-[260px] md:h-[100vh] md:max-w-full",
    iconSrc: "/Physiotherapy-icon.png",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#E5F7F6] -mt-16 pb-16 pt-16 md:-mt-52 md:pb-24 md:pt-52"
    >
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-6 md:grid-cols-[1.2fr,0.9fr] md:items-end">
          <FadeIn direction="up" duration={800} distance={30} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkle className="h-4 w-4" />
                <span>Our Service</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                Our Services Designed
                <br />
                for Real Life
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={30} delay={150}>
            <p className="max-w-md text-sm leading-6 text-gray-500 md:text-[13px]">
              Scientifically designed sessions tailored to your body. We focus on
              long-term results, not temporary relief.
            </p>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2">
          {services.map((service, index) => (
            <FadeIn
              key={service.title}
              direction="up"
              duration={850}
              distance={40}
              delay={index * 20}
            >
            <article
              className="group relative text-center md:text-left overflow-hidden rounded-bl-xl rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl h-[60vh] bg-[#FFFDF1] md:p-8 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:px-5 md:py-5 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center md:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Image
                    src={(service as any).iconSrc}
                    alt={`${service.title} icon`}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                  {service.description}
                </p>
              </div>

              <div
                className={`absolute overflow-hidden ${
                  (service as any).imageWrapperClass ??
                  "h-40 -bottom-20 right-24 w-full max-w-[220px] md:h-96 md:max-w-[420px]"
                }`}
              >
                <Image
                  src={service.imageSrc}
                  alt={service.title}
                  fill
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                  priority={false}
                />
              </div>

              <div className="mt-5 absolute bottom-8 right-1/2 translate-x-1/2 flex flex-wrap justify-center gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-800 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
