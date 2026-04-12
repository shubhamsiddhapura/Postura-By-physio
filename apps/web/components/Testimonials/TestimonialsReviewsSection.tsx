"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";

type Testimonial = {
  tag: string;
  quote: string;
  name: string;
  age: number;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    tag: "IT Professional",
    quote:
      "Long sitting hours caused severe neck pain. After treatment, I feel much more comfortable and productive at work.",
    name: "Rahul Shah",
    age: 30,
    avatar: "/cp-1.jpg",
  },
  {
    tag: "Homemaker",
    quote:
      "The aerobics and yoga sessions improved my energy and flexibility. I feel more active throughout the day.",
    name: "Neha Patel",
    age: 42,
    avatar: "/pn-yoga.jpg",
  },
  {
    tag: "Corporate / Desk Job",
    quote:
      "My lower back pain from long meetings eased within weeks. The posture guidance alone changed how I sit and move.",
    name: "Amit Desai",
    age: 38,
    avatar: "/it-physiotherapy.jpg",
  },
  {
    tag: "Teacher / Standing Job",
    quote:
      "Standing all day hurt my knees and feet. The structured exercises fit my schedule and the pain is finally manageable.",
    name: "Pooja Mehta",
    age: 45,
    avatar: "/society-1.jpg",
  },
  {
    tag: "Healthcare Worker",
    quote:
      "Shift work and lifting left me with shoulder strain. Professional, patient-focused care got me back to full duty.",
    name: "Dr. Sanjay Rao",
    age: 36,
    avatar: "/gr-physio.jpg",
  },
  {
    tag: "Senior Citizen",
    quote:
      "Balance and walking confidence improved after geriatric rehab. I feel safer at home and enjoy short walks again.",
    name: "Kamlesh Shah",
    age: 72,
    avatar: "/gr-1.jpg",
  },
  {
    tag: "Athlete",
    quote:
      "The rehab program helped me recover from injury and return to sports stronger than before.",
    name: "Kunal Joshi",
    age: 27,
    avatar: "/athlete-physio.jpg",
  },
  {
    tag: "Student",
    quote:
      "Screen time and study posture gave me headaches. Simple corrections and stretches made a big difference in weeks.",
    name: "Isha Verma",
    age: 21,
    avatar: "/bi-1.jpg",
  },
  {
    tag: "Pre & Post Natal",
    quote:
      "Supportive, gentle sessions after delivery helped me rebuild core strength without feeling rushed or overwhelmed.",
    name: "Ananya Krishnan",
    age: 31,
    avatar: "/pn-1.jpg",
  },
  {
    tag: "Fitness Enthusiast",
    quote:
      "Prehab sessions reduced niggles before they became injuries. I train harder with better body awareness now.",
    name: "Vikram Singh",
    age: 29,
    avatar: "/athlete-1.jpg",
  },
  {
    tag: "Society Member",
    quote:
      "Group sessions in our society are fun and consistent. My stamina and flexibility improved more than I expected.",
    name: "Meera Iyer",
    age: 55,
    avatar: "/society-yoga.jpg",
  },
  {
    tag: "Physiotherapy Patient",
    quote:
      "Clear explanations and a step-by-step plan helped me trust the process. I’m pain-free and moving freely again.",
    name: "Harsh Trivedi",
    age: 34,
    avatar: "/physio-1.jpg",
  },
  {
    tag: "IT Professional",
    quote:
      "Doorstep sessions saved my commute time and recovery stayed on track. Highly recommend for busy professionals.",
    name: "Priya Nair",
    age: 33,
    avatar: "/cp-2.jpg",
  },
  {
    tag: "Homemaker",
    quote:
      "Knee stiffness from daily chores reduced noticeably. The home exercises were easy to follow between visits.",
    name: "Sunita Dave",
    age: 48,
    avatar: "/bi-2.jpg",
  },
  {
    tag: "Corporate / Desk Job",
    quote:
      "Wrist and forearm pain from typing improved with ergonomic tips plus therapy. I finally sleep without discomfort.",
    name: "Rohan Kapadia",
    age: 41,
    avatar: "/it-common-challenges.jpg",
  },
  {
    tag: "Senior Citizen",
    quote:
      "My family noticed I climb stairs more confidently. Gentle progress each week kept me motivated.",
    name: "Jayantibhai Modi",
    age: 68,
    avatar: "/gr-2.jpg",
  },
  {
    tag: "Athlete",
    quote:
      "Return-to-play was structured and safe. I trust the team to push me without risking re-injury.",
    name: "Dev Patel",
    age: 24,
    avatar: "/athlete-2.jpg",
  },
  {
    tag: "Student",
    quote:
      "Online consults between exams fit my routine. Practical advice I could do in my hostel room.",
    name: "Arjun Malhotra",
    age: 20,
    avatar: "/blog-intro.jpg",
  },
];

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 6;

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" strokeWidth={0} />
      ))}
    </div>
  );
}

export function TestimonialsReviewsSection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = useMemo(() => TESTIMONIALS.slice(0, visibleCount), [visibleCount]);
  const canShowMore = visibleCount < TESTIMONIALS.length;

  const handleViewMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, TESTIMONIALS.length));
  };

  return (
    <section id="customer-reviews" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[90vw] md:px-4">
        <div className="grid gap-8 md:grid-cols-[1fr,1.1fr] md:items-end">
          <FadeIn direction="up" distance={32} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">Customer Reviews</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Real Experiences. Real<br /> Results.
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100} className="md:justify-self-end">
            <p className="text-center text-sm leading-7 text-gray-500 md:text-left md:text-base">
              Discover how our personalized physiotherapy and wellness programs have helped individuals recover, stay
              active, and improve their quality of life.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visible.map((t, index) => (
            <FadeIn key={`${t.name}-${t.age}-${index}`} direction="up" distance={24} duration={700} delay={index * 35}>
              <article className="flex h-full flex-col rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-[#fafafa] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <StarRating />
                  <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-900">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-5 flex-1 text-sm leading-7 text-gray-900 md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
                    <Image src={t.avatar} alt="" fill className="object-cover" sizes="44px" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}{" "}
                    <span className="font-medium text-gray-600">({t.age})</span>
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {canShowMore ? (
          <FadeIn direction="up" distance={20} duration={700} delay={120}>
            <div className="mt-14 flex justify-center md:mt-16">
              <PrimaryCTAButton
                href="#customer-reviews"
                label="View More"
                size="md"
                className="pr-8"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewMore();
                }}
              />
            </div>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
