import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import Image from "next/image";
import { FadeIn } from "../../components/ui/FadeIn";
import { ArrowUpRight } from "lucide-react";

const blogSlides = [
  {
    src: "/blog-hero.png",
    mobileSrc: "/blog-hero.png",
    alt: "Blogs",
    tag: "Postura Insights",
    headline: "Health & Wellness<br/> Insights",
    body: "Explore expert tips, physiotherapy guidance, fitness knowledge, and preventive care insights to help you stay active, recover safely, and improve your overall well-being.",
    sub: "",
  },
];

const posts = [
  {
    imageSrc: "/blog1.jpg",
    title: "Neck Pain in IT Professionals: Causes & Physiotherapy Solutions",
    date: "February 27, 2026",
  },
  {
    imageSrc: "/blog2.jpg",
    title: "The Importance of Postural Correction for Desk Workers",
    date: "February 18, 2026",
  },
  {
    imageSrc: "/blog3.jpg",
    title: "Safe Exercises for Post-Pregnancy Recovery",
    date: "February 10, 2026",
  },
  {
    imageSrc: "/blog4.jpg",
    title: "Managing Knee Pain with Structured Rehabilitation",
    date: "January 28, 2026",
  },
  {
    imageSrc: "/blog5.jpg",
    title: "Benefits of Yoga Therapy for Stress & Flexibility",
    date: "January 15, 2026",
  },
  {
    imageSrc: "/blog6.jpg",
    title: "Senior Wellness: Improving Balance & Mobility with Physiotherapy",
    date: "January 05, 2026",
  },
] as const;

export default function BlogsPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={blogSlides} id="blogs-hero" showBookSessionButton />

      <main className="bg-white">
        <section className="mx-auto md:max-w-[90vw] px-4 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 md:items-start text-center md:text-left">
            <FadeIn
              direction="up"
              duration={850}
              distance={30}
              delay={0}
              className="md:col-span-7"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                <Image
                  src="/sparkle.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="text-primary">New Insight’s</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Latest Physiotherapy &amp; <br />
                Wellness Articles
              </h2>
            </FadeIn>

            <FadeIn
              direction="up"
              duration={850}
              distance={30}
              delay={120}
              className="md:col-span-5 md:pt-10"
            >
              <p className="text-sm leading-6 text-gray-500">
                Stay updated with expert insights on physiotherapy,
                rehabilitation, fitness, posture care, and preventive wellness
                to support a healthier and more active lifestyle.
              </p>
            </FadeIn>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
            {posts.map((post) => (
              <FadeIn
                key={post.title}
                direction="up"
                duration={850}
                distance={30}
                delay={0}
              >
                <article className="group relative overflow-hidden rounded-[28px] bg-gray-100 shadow-sm">
                  <div className="relative h-[320px] w-full md:h-[420px]">
                    <Image
                      src={post.imageSrc}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 30vw, 90vw"
                      priority={false}
                    />
                  </div>

                  {/* Top-right icon badge */}
                  <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary shadow-sm">
                    <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-sm backdrop-blur">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">{post.date}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn
            direction="up"
            duration={850}
            distance={30}
            delay={120}
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-90"
            >
              View More
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FEF9E0]">
                <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}

