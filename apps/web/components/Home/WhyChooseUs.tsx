import type { ComponentType, ReactNode } from "react";
import {
  Activity,
  DoorOpen,
  Dumbbell,
  HeartHandshake,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export type WhyChooseUsItem = {
  /** Card heading (shown in teal below the icon). */
  title: string;
  /** Optional body copy under the title. Omit for icon + title only (e.g. services page). */
  description?: string;
  /** Lucide (or similar) icon — ignored if `iconElement` is set. */
  icon?: ComponentType<{ className?: string }>;
  /** Custom SVG, `Image`, or JSX inside the teal circle (takes precedence over `icon`). */
  iconElement?: ReactNode;
};

export type WhyChooseUsProps = {
  id?: string;
  className?: string;
  /** Small label beside the sparkle (e.g. section theme). */
  eyebrow?: ReactNode;
  /** Main heading (string or JSX, e.g. with <br />). */
  title?: ReactNode;
  /** Intro copy shown beside / below the title on larger screens. */
  description?: ReactNode;
  /** Defaults to the home page five cards when omitted. */
  items?: WhyChooseUsItem[];
  /** Grid columns from `md` up (default `5` for home). */
  mdColumns?: 2 | 3 | 4 | 5;
  /** Set false to hide the sparkle icon before the eyebrow. */
  showSparkle?: boolean;
};

const defaultItems: WhyChooseUsItem[] = [
  {
    title: "Assessment-\nBased Care",
    description:
      "No generic exercises.\nEvery plan starts with\nclinical evaluation.",
    iconElement: <Image src="/landing-1.svg" alt="Assessment-Based Care" width={30} height={30} />,
  },
  {
    title: "Doorstep\nPhysiotherapy",
    description: "Zero travel. Better\nconsistency. Faster\nrecovery.",
    iconElement: <Image src="/landing-5.svg" alt="Doorstep Physiotherapy" width={30} height={30} />,
  },
  {
    title: "Physio-Led\nFitness",
    description: "Every session supervised\nby certified\nphysiotherapists.",
    iconElement: <Image src="/landing-2.svg" alt="Physio-Led Fitness" width={30} height={30} />,
  },
  {
    title: "Prehab + Rehab\nModel",
    description: "We prevent injuries not\njust treat them.",
    iconElement: <Image src="/landing-3.svg" alt="Prehab + Rehab Model" width={30} height={30} />,
  },
  {
    title: "Online & Offline\nsession",
    description: "Flexible care options for\nevery schedule.",
    iconElement: <Image src="/landing-4.svg" alt="Online & Offline session" width={30} height={30} />,
  },
];

// Tablet-portrait (md, < lg) gets a friendlier column count; desktop (lg+)
// preserves the original column count for each `mdColumns` selection.
const mdColClass: Record<NonNullable<WhyChooseUsProps["mdColumns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-3 lg:grid-cols-5",
};

function ItemIcon({ item }: { item: WhyChooseUsItem }) {
  if (item.iconElement != null) {
    return <>{item.iconElement}</>;
  }
  const Icon = item.icon;
  if (Icon) {
    return <Icon className="h-6 w-6 text-white" />;
  }
  return null;
}

export function WhyChooseUs({
  id = "why-choose-us",
  className = "",
  eyebrow = "Expertise you can trust.",
  title = "Why Choose Us",
  description = "Expert care designed around your body, your goals, and your lifestyle.",
  items = defaultItems,
  mdColumns = 5,
  showSparkle = true,
}: WhyChooseUsProps) {
  const gridMd = mdColClass[mdColumns];

  return (
    <section id={id} className={`bg-white ${className}`.trim()}>
      <div className="mx-auto max-w-[90vw] py-16 md:px-4 md:py-10">
        <div className="grid gap-3 md:grid-cols-[1fr,1.2fr] md:items-end md:gap-10">
          <FadeIn direction="up" duration={800} distance={30} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary md:justify-start">
                {showSparkle ? (
                  <Image
                    src="/sparkle.svg"
                    alt="Sparkle icon"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                ) : null}
                <span>{eyebrow}</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn
            direction="up"
            duration={800}
            distance={30}
            delay={120}
            className="md:justify-self-end"
          >
            <div className="max-w-xl text-center text-sm leading-6 text-gray-500 md:text-left">
              {description}
            </div>
          </FadeIn>
        </div>

        <div className={`mt-12 grid grid-cols-1 gap-6 ${gridMd} md:items-stretch`}>
          {items.map((item, index) => (
            <FadeIn
              key={`${item.title}-${index}`}
              direction="up"
              duration={750}
              distance={35}
              delay={200 + index * 100}
              className="h-full"
            >
              <div
                className={[
                  "flex h-full cursor-pointer flex-col items-center rounded-bl-xl rounded-br-[36px] rounded-tl-[36px] rounded-tr-xl bg-gray-50 px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] transition-transform duration-300 hover:scale-105 md:items-start",
                  item.description ? "md:min-h-[200px]" : "md:min-h-[140px] gap-5",
                ].join(" ")}
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-white [&_svg]:shrink-0">
                  <ItemIcon item={item} />
                </div>

                <div
                  className={
                    item.description
                      ? "mt-6 flex w-full flex-col"
                      : "flex w-full flex-col justify-end pt-4"
                  }
                >
                  <h3 className="text-center text-lg md:text-xl font-semibold text-primary md:whitespace-pre-line md:text-left">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-4 text-center text-sm leading-6 text-gray-500 md:whitespace-pre-line md:text-left">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
