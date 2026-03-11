import Image from "next/image";
import { ArrowUpRight, Sparkle } from "lucide-react";

type Card = {
  title: string;
  subtitle: string;
  imageSrc: string;
};

const cards: Card[] = [
  {
    title: "Corporate / IT Employees",
    subtitle: "Better posture. Better performance.",
    imageSrc: "/wcju-1.jpg",
  },
  {
    title: "Fitness for active adults",
    subtitle: "Fitness feels better together.",
    imageSrc: "/wcju-2.png",
  },
  {
    title: "Pre & Post Natal Care",
    subtitle: "Strong recovery. Confident motherhood.",
    imageSrc: "/wcju-3.jpg",
  },
  {
    title: "Geriatric Rehabilitation",
    subtitle: "Stay steady. Stay independent.",
    imageSrc: "/wcju-4.jpg",
  },
  {
    title: "Physiotherapy Services",
    subtitle: "From pain to progress.",
    imageSrc: "/wcju-5.jpg",
  },
  {
    title: "Prehab for Fitness Lovers",
    subtitle: "Train smart. Prevent injuries.",
    imageSrc: "/wcju-6.jpg",
  },
];

export function WhoCanJoin() {
  return (
    <section id="who-can-join" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr,1.15fr] md:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Sparkle className="h-4 w-4 text-primary" />
              <span className="text-primary">Care for all.</span>
            </div>
            <h2 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
              Who Can Join Us?
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-gray-500 md:mt-2 md:justify-self-end">
            Whether you&apos;re dealing with pain, recovering from injury, or
            simply looking to stay active, our programs are designed for
            individuals at every stage of life.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative cursor-pointer overflow-hidden rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl bg-gray-100"
            >
              <div className="relative aspect-[4/5] w-full h-[450px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover"
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
                <div className="text-2xl font-semibold">{card.title}</div>
                <div className="mt-2 text-sm text-white/85">
                  {card.subtitle}
                </div>
              </div>

              {/* subtle inner stroke like screenshot */}
              <div className="pointer-events-none absolute inset-5 rounded-bl-lg rounded-tl-3xl rounded-br-3xl rounded-tr-lg ring-1 ring-[#FEF9E0]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

