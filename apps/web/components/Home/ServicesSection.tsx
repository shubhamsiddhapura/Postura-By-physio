import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

export type ServicesSectionCard = {
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  iconSrc: string;
  href?: string;
  /** Tailwind classes for the decorative image position/size (card-specific). */
  imageWrapperClass?: string;
};

export type ServicesSectionProps = {
  id?: string;
  className?: string;
  /** Small label next to the sparkle (default: “Our Service”). */
  eyebrow?: string;
  showSparkle?: boolean;
  /** Main heading (supports <br /> via ReactNode). */
  title?: ReactNode;
  /** Intro copy beside / below the heading on larger screens. */
  description?: ReactNode;
  /** Service cards; defaults to the four home-page programs when omitted. */
  cards?: ServicesSectionCard[];
  /** Negative top margin (home overlaps footer wave); set false on inner pages. */
  overlapFooter?: boolean;
};

const defaultCards: ServicesSectionCard[] = [
  {
    title: "Aerobics",
    description:
      "Fun, rhythmic workouts designed to boost heart health and endurance—safe for all fitness levels.",
    imageSrc: "/aerobics.png",
    tags: ["Weight loss", "Stamina", "Energy"],
    imageWrapperClass:
      "-bottom-12 left-1/2 -translate-x-1/2 scale-[1.25] lg:scale-100 h-[55%] w-[60%] lg:left-auto lg:translate-x-0 lg:-bottom-36 lg:right-0 lg:w-full lg:h-full lg:max-w-full",
    iconSrc: "/aerobics-icon.svg",
    href: "/aerobics-program",
  },
  {
    title: "Pilates",
    description:
      "Controlled movements that strengthen your core and correct posture safely.",
    imageSrc: "/Pilates.png",
    tags: ["Core", "Posture", "Injury Prevention"],
    imageWrapperClass:
      "bottom-0 left-1/2 -translate-x-1/2 scale-[1.5] lg:scale-100 h-[55%] w-[60%] lg:left-auto lg:translate-x-0 lg:-bottom-20 lg:right-10 lg:w-full lg:h-full lg:max-w-full",
    iconSrc: "/plates-icon.svg",
    href: "/pilates-program",
  },
  {
    title: "Yoga",
    description:
      "Structured yoga & power yoga sessions for strength, calm, and mobility.",
    imageSrc: "/yoga.png",
    tags: ["Stress", "Flexibility", "Balance"],
    imageWrapperClass:
      "-bottom-16 left-1/2 -translate-x-1/2 scale-[1.5] lg:scale-100 h-[55%] w-[60%] lg:left-auto lg:translate-x-0 lg:-bottom-40 lg:right-0 lg:w-full lg:h-full lg:max-w-full",
    iconSrc: "/yoga-icon.svg",
    href: "/yoga-program",
  },
  {
    title: "Physiotherapy",
    description:
      "Personalized rehab programs using advanced techniques like dry needling & cupping.",
    imageSrc: "/Physiotherapy.png",
    tags: ["Pain", "Recovery", "Mobility"],
    imageWrapperClass:
      "-bottom-20 left-1/2 -translate-x-1/2 scale-[2] lg:scale-100 h-[70%] w-[60%] lg:left-auto lg:translate-x-0 lg:bottom-auto lg:top-0 lg:right-0 lg:w-full lg:h-[100vh] lg:max-w-full",
    iconSrc: "/Physiotherapy-icon.svg",
    href: "/physiotherapy",
  },
];

const defaultTitle = (
  <>
    Our Services Designed
    <br />
    for Real Life
  </>
);

const defaultDescription =
  "Scientifically designed sessions tailored to your body. We focus on long-term results, not temporary relief.";

const fallbackImageWrapper =
  "h-40 -bottom-20 right-24 w-full max-w-[220px] md:h-96 md:max-w-[420px]";

export function ServicesSection({
  id = "services",
  className,
  eyebrow = "Our Service",
  showSparkle = true,
  title = defaultTitle,
  description = defaultDescription,
  cards = defaultCards,
  overlapFooter = true,
}: ServicesSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "bg-[#E5F7F6] pb-16 pt-16 md:pb-24",
        overlapFooter ? "-mt-16 md:-mt-52 md:pt-52" : "md:pt-20",
        className,
      )}
    >
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-6 md:grid-cols-[1.2fr,0.9fr] md:items-end">
          <FadeIn direction="up" duration={800} distance={30} delay={0}>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-primary">
                {showSparkle ? (
                  <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                ) : null}
                <span>{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-3xl lg:text-5xl">{title}</h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={30} delay={150}>
            <div className="max-w-md text-sm leading-6 text-gray-500 md:text-[13px]">{description}</div>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2">
          {cards.map((service, index) => (
            <FadeIn
              key={service.title}
              direction="up"
              duration={850}
              distance={40}
              delay={index * 20}
            >
              {service.href ? (
                <Link
                  href={service.href}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E5F7F6]"
                >
                  <article className="relative h-[400px] overflow-hidden rounded-bl-xl rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl bg-[#FFFDF1] p-4 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:scale-[1.02] md:h-[460px] lg:h-[60vh] lg:px-5 lg:py-5 lg:text-left">
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Image
                          src={service.iconSrc}
                          alt={`${service.title} icon`}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="mt-4 text-3xl font-semibold text-gray-900">{service.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">{service.description}</p>
                    </div>

                    <div
                      className={cn(
                        "absolute overflow-hidden",
                        service.imageWrapperClass ?? fallbackImageWrapper,
                      )}
                    >
                      <Image
                        src={service.imageSrc}
                        alt={service.title}
                        fill
                        className="object-contain"
                        priority={false}
                      />
                    </div>

                    <div className="absolute bottom-8 right-1/2 z-10 mt-5 flex max-w-[95%] translate-x-1/2 flex-nowrap justify-center gap-2 overflow-x-auto lg:max-w-none lg:flex-wrap lg:gap-3">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex-shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-800 lg:px-4"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ) : (
                <article className="relative h-[400px] overflow-hidden rounded-bl-xl rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl bg-[#FFFDF1] p-4 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:scale-[1.02] md:h-[460px] lg:h-[60vh] lg:px-5 lg:py-5 lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Image
                      src={service.iconSrc}
                      alt={`${service.title} icon`}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">{service.description}</p>
                </div>

                <div
                  className={cn(
                    "absolute overflow-hidden",
                    service.imageWrapperClass ?? fallbackImageWrapper,
                  )}
                >
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-contain"
                    priority={false}
                  />
                </div>

                <div className="absolute bottom-8 right-1/2 z-10 mt-5 flex max-w-[95%] translate-x-1/2 flex-nowrap justify-center gap-2 overflow-x-auto lg:max-w-none lg:flex-wrap lg:gap-3">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex-shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-[0_10px_25px_rgba(15,23,42,0.08)] lg:px-4"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export const defaultServicesSectionCards = defaultCards;
