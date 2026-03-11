import {
  Activity,
  DoorOpen,
  Dumbbell,
  HeartHandshake,
  Monitor,
  Sparkle,
} from "lucide-react";

type Item = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  {
    title: "Assessment-\nBased Care",
    description:
      "No generic exercises.\nEvery plan starts with\nclinical evaluation.",
    icon: Activity,
  },
  {
    title: "Doorstep\nPhysiotherapy",
    description: "Zero travel. Better\nconsistency. Faster\nrecovery.",
    icon: DoorOpen,
  },
  {
    title: "Physio-Led\nFitness",
    description: "Every session supervised\nby certified\nphysiotherapists.",
    icon: HeartHandshake,
  },
  {
    title: "Prehab + Rehab\nModel",
    description: "We prevent injuries not\njust treat them.",
    icon: Dumbbell,
  },
  {
    title: "Online & Offline\nsession",
    description: "Flexible care options for\nevery schedule.",
    icon: Monitor,
  },
];

export function WhyChooseUs() {
  return (
    <section id="services" className="bg-white">
      <div className="mx-auto max-w-[90vw] px-4 py-16 md:py-10">
        <div className="grid gap-10 md:grid-cols-[1fr,1.2fr] md:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkle className="h-4 w-4" />
              <span>Expertise you can trust.</span>
            </div>
            <h2 className="mt-4 text-5xl font-bold tracking-tight text-gray-900">
              Why Choose Us
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-gray-500 md:justify-self-end">
            Expert care designed around your body, your goals, and your
            lifestyle.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-bl-xl rounded-tl-[36px] rounded-br-[36px] rounded-tr-xl bg-gray-50 px-7 py-8 shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary">
                <item.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="mt-6 whitespace-pre-line text-xl font-semibold text-primary">
                {item.title}
              </h3>
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

