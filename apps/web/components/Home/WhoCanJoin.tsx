import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";

export type WhoCanJoinCard = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href?: string;
};

const defaultCards: WhoCanJoinCard[] = [
  {
    title: "Corporate / IT Employees",
    subtitle: "Better posture. Better performance.",
    imageSrc: "/wcju-1.jpg",
    href: "/corporate-professionals",
  },
  {
    title: "Fitness for active adults",
    subtitle: "Fitness feels better together.",
    imageSrc: "/wcju-2.png",
    href: "/society-exercise",
  },
  {
    title: "Pre & Post Natal Care",
    subtitle: "Strong recovery. Confident motherhood.",
    imageSrc: "/wcju-3.jpg",
    href: "/pre-post-natal",
  },
  {
    title: "Geriatric Rehabilitation",
    subtitle: "Stay steady. Stay independent.",
    imageSrc: "/wcju-4.jpg",
    href: "/geriatric-rehabilitation",
  },
  {
    title: "Physiotherapy Services",
    subtitle: "From pain to progress.",
    imageSrc: "/wcju-5.jpg",
    href: "/physiotherapy-management",
  },
  {
    title: "Prehab for Fitness Lovers",
    subtitle: "Train smart. Prevent injuries.",
    imageSrc: "/wcju-6.jpg",
    href: "/athlete-rehab",
  },
];

export type WhoCanJoinProps = {
  /** Section id for in-page navigation. */
  id?: string;
  /** Small label next to the sparkle icon. */
  eyebrow?: string;
  /** Main heading. */
  title?: ReactNode;
  /** Supporting paragraph. */
  description?: ReactNode;
  /** Cards grid content. */
  cards?: WhoCanJoinCard[];
};

const defaultTitle = <>Who Can Join Us?</>;
const defaultDescription = (
  <>
    Whether you&apos;re dealing with pain, recovering from injury, or simply looking to stay active, our programs are
    designed for individuals at every stage of life.
  </>
);

export function WhoCanJoin({
  id = "who-can-join",
  eyebrow = "Care for all.",
  title = defaultTitle,
  description = defaultDescription,
  cards = defaultCards,
}: WhoCanJoinProps) {
  return (
    <section id={id} className="bg-white">
      <div className="mx-auto max-w-[90vw] md:px-4 py-16 md:py-20">
        <div className="grid md:gap-10 gap-5 md:grid-cols-[1fr,1.15fr] md:items-end text-center md:text-left">
          <FadeIn direction="up" distance={32} duration={800} delay={0}>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 md:text-5xl text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={120} className="md:justify-self-end">
            <p className="max-w-2xl text-sm leading-6 text-gray-500 md:mt-2">
              {description}
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <FadeIn key={card.title} direction="up" delay={index * 50} duration={800}>
            {card.href ? (
              <Link
                href={card.href}
                className="group relative block cursor-pointer overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl bg-gray-100"
              >
                <div className="relative aspect-[4/5] w-full md:h-[450px] overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Bottom primary overlay (no blur) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                </div>

                {/* Arrow badge */}
                <div className="absolute right-10 top-10 z-10 grid h-9 w-9 place-items-center rounded-full bg-secondary shadow-sm">
                  <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                </div>

                {/* Content (sits on top of the primary gradient) */}
                <div className="absolute inset-x-10 bottom-8 z-10 text-white">
                  <div className="text-2xl font-semibold font-cabinet">{card.title}</div>
                  <div className="mt-2 text-sm text-white/85">
                    {card.subtitle}
                  </div>
                </div>

                {/* subtle inner stroke like screenshot */}
                <div className="pointer-events-none absolute inset-5 rounded-bl-lg rounded-tl-3xl rounded-br-3xl rounded-tr-lg ring-1 ring-[#FEF9E0]" />
              </Link>
            ) : (
              <div
                className="group relative cursor-pointer overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl bg-gray-100"
              >
              <div className="relative aspect-[4/5] w-full md:h-[450px] overflow-hidden">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10" />

                {/* Bottom primary overlay (no blur) */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
              </div>

              {/* Arrow badge */}
              <div className="absolute right-10 top-10 z-10 grid h-9 w-9 place-items-center rounded-full bg-secondary shadow-sm">
                <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </div>

              {/* Content (sits on top of the primary gradient) */}
              <div className="absolute inset-x-10 bottom-8 z-10 text-white">
                <div className="text-2xl font-semibold font-cabinet">{card.title}</div>
                <div className="mt-2 text-sm text-white/85">
                  {card.subtitle}
                </div>
              </div>

              {/* subtle inner stroke like screenshot */}
              <div className="pointer-events-none absolute inset-5 rounded-bl-lg rounded-tl-3xl rounded-br-3xl rounded-tr-lg ring-1 ring-[#FEF9E0]" />
              </div>
            )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
