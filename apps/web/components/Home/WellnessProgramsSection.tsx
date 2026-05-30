import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

export type WellnessProgramItem = {
  title: string;
  imageSrc: string;
  alt: string;
  /** Defaults to `/book-a-session`. */
  href?: string;
};

export type WellnessProgramsSectionProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  showSparkle?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  items?: WellnessProgramItem[];
};

const defaultItems: WellnessProgramItem[] = [
  {
    title: "Swiss Ball Training",
    alt: "Swiss ball core training",
    imageSrc: "/services-1.jpg",
    href: "/swiss-ball-training",
  },
  {
    title: "Couple Exercise",
    alt: "Couple stretching and exercise together",
    imageSrc: "/services-2.jpg",
    href: "/couple-exercise-program",
  },
  {
    title: "Theraband Training",
    alt: "Resistance band training",
    imageSrc: "/services-3.jpg",
    href: "/theraband-training",
  },
  {
    title: "Flexibar Training",
    alt: "Flexibility and bar-assisted training",
    imageSrc: "/flexi-training.png",
    href: "/flexibar-training",
  },
];

const defaultTitle = "Our Wellness Programs";

const defaultDescription =
  "Professionally guided programs designed to improve strength, flexibility, and overall physical performance.";

export function WellnessProgramsSection({
  id = "wellness-programs",
  className,
  eyebrow = "Wellness Program",
  showSparkle = true,
  title = defaultTitle,
  description = defaultDescription,
  items = defaultItems,
}: WellnessProgramsSectionProps) {
  return (
    <section id={id} className={cn("bg-white py-16 md:py-20", className)}>
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-4 md:grid-cols-[1.1fr,1fr] md:items-end md:gap-12 lg:grid-cols-[1.15fr,0.95fr]">
          <FadeIn direction="up" duration={800} distance={28} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary md:justify-start">
                {showSparkle ? (
                  <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                ) : null}
                <span>{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={28} delay={100} className="md:justify-self-end">
            <div className="text-center text-sm leading-7 text-gray-500 md:text-left md:text-base">
              {description}
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {items.map((item, index) => (
            <FadeIn
              key={item.title}
              direction="up"
              duration={750}
              distance={32}
              delay={120 + index * 60}
            >
              <article className="group">
                <Link
                  href={item.href ?? "/book-a-session"}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={`Learn more about ${item.title}`}
                >
                  <div className="relative md:aspect-[1/1.2] aspect-square w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] rounded-tr-xl rounded-bl-xl bg-gray-100 shadow-[0_12px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]">
                    <Image
                      src={item.imageSrc}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-900 md:text-lg">{item.title}</h3>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-sm transition group-hover:brightness-90">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                  </div>
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export const defaultWellnessProgramItems = defaultItems;
