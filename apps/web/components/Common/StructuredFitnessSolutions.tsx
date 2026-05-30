import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export type StructuredSolutionItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type StructuredFitnessSolutionsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: StructuredSolutionItem[];
};

export function StructuredFitnessSolutions({
  eyebrow = "How Our Structured Fitness Program Helps",
  title = "Structured Fitness\nSolutions for Workplace\nWellness",
  description = "Through guided movement, posture correction, and targeted strengthening, our programs help corporate professionals manage stress, prevent injuries, and maintain long-term physical well-being.",
  items = [
    {
      title: "Aerobics",
      description: "Boosts energy and improves daily endurance.",
      imageSrc: "/it-aerobics.jpg",
      imageAlt: "Aerobics",
    },
    {
      title: "Physiotherapy",
      description: "Relieves pain and corrects posture.",
      imageSrc: "/it-physiotherapy.jpg",
      imageAlt: "Physiotherapy",
    },
    {
      title: "Yoga",
      description: "Reduces stress and improves flexibility.",
      imageSrc: "/it-yoga.jpg",
      imageAlt: "Yoga",
    },
    {
      title: "Pilates",
      description: "Strengthens core and prevents injuries.",
      imageSrc: "/it-pilates.jpg",
      imageAlt: "Pilates",
    },
  ],
}: StructuredFitnessSolutionsProps) {
  const getGridColsClass = (count: number) => {
    if (count <= 1) return "md:grid-cols-1 md:max-w-[320px] md:mx-auto";
    if (count === 2) return "md:grid-cols-2";
    if (count === 3) return "md:grid-cols-3";
    // Tablet-portrait (md, < lg) gets 2 cols; desktop (lg+) keeps 4 cols.
    return "md:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section id="structured-fitness-solutions" className="bg-white">
      <div className="py-10 md:py-16">
        <div className="overflow-hidden rounded-[46px] bg-primary px-6 py-10 md:px-20 md:py-14">
          {/* Header */}
          <div className="grid gap-8 md:grid-cols-[1.35fr,1fr] md:items-end">
            <FadeIn direction="up" duration={800} distance={30} delay={0}>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-white/85 justify-center md:justify-start">
                  <Image
                    src="/white-sparkle.svg"
                    alt="Sparkle icon"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <span>{eyebrow}</span>
                </div>
                <h2 className="mt-4 whitespace-pre-line text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  {title}
                </h2>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={140}>
              <p className="max-w-md text-sm leading-6 text-white/80 md:mt-10 text-center md:text-left">
                {description}
              </p>
            </FadeIn>
          </div>

          {/* Cards */}
          <div className={`mt-14 grid gap-8 ${getGridColsClass(items.length)}`}>
            {items.map((item, idx) => (
              <FadeIn
                key={item.title}
                direction="up"
                duration={800}
                distance={26}
                delay={220 + idx * 90}
              >
                <div className="flex h-full flex-col">
                  <div className="relative overflow-hidden rounded-tl-[42px] rounded-br-[42px] rounded-tr-xl rounded-bl-xl bg-white/10">
                    <div className="aspect-[1/1] w-full">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 768px) 22vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className=" text-sm leading-5 text-white/80">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

