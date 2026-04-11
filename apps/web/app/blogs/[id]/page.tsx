import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Armchair,
  Brain,
  Calendar,
  Dumbbell,
  Footprints,
  HandHeart,
  LaptopMinimal,
  MousePointer2,
  PersonStanding,
  User,
} from "lucide-react";
import { Footer } from "../../../components/Home/Footer";
import { WhyChooseUs } from "../../../components/Home/WhyChooseUs";
import { getBlogPostById } from "../posts-static";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { KeyBenefits } from "@/components/Common/KeyBenefits";

const heroTeal = "#007575";
const heroCream = "#fdfcf0";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps) {
  const post = getBlogPostById(params.id);
  if (!post) return { title: "Article | Postura by Physio" };
  return {
    title: `${post.title} | Postura by Physio`,
    description: post.paragraphs[0]?.slice(0, 160),
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const { id } = params;
  const post = getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="overflow-x-hidden">
      {/* Hero: teal panel + overlapping image */}
      <section className="relative pb-0">
        <div
          className="relative overflow-hidden rounded-br-[clamp(3rem,12vw,7.5rem)] rounded-bl-3xl pb-[clamp(8rem,22vw,14rem)] flex items-center pt-10 md:pt-14 md:h-screen h-[90vh]"
          style={{ backgroundColor: heroTeal }}
        >
          <div className="px-4 md:mx-32 text-center md:text-left">

            <p className="flex items-center gap-2 md:text-sm text-xs font-medium text-[#FEF9E0] justify-center md:justify-start">
              <span>✦</span>
              {post.eyebrow}
            </p>

            <h1
              className="mt-4 max-w-4xl font-cabinet text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-6xl lg:leading-[1.15] text-[#FEF9E0]"
            >
              {post.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-20 md:gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-3 flex-col md:flex-row">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg md:h-11 md:w-11 bg-[#FEF9E0]"
                >
                  <Calendar
                    className="h-[18px] w-[18px] md:h-5 md:w-5"
                    style={{ color: heroTeal }}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                <span
                  className="text-sm font-medium md:text-base text-[#FEF9E0]"
                >
                  {post.date}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-col md:flex-row">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg md:h-11 md:w-11 bg-[#FEF9E0]"
                >
                  <User
                    className="h-[18px] w-[18px] md:h-5 md:w-5"
                    style={{ color: heroTeal }}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                <span
                  className="text-sm font-medium md:text-base text-[#FEF9E0]"
                >
                  {post.author}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto md:-mt-60 -mt-40 max-w-7xl px-4">
          <div className="relative h-[300px] md:h-[580px] w-full overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-tr-[84px] rounded-bl-[84px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 896px, 90vw"
              priority
            />
          </div>
        </div>
      </section>

      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow="Intro"
          title="Introduction"
          description="In today’s digital work culture, IT professionals and desk-based employees spend long hours sitting in front of computers. While technology improves productivity, it also increases the risk of posture-related health problems, especially neck pain. What often begins as mild stiffness or occasional discomfort can gradually develop into chronic pain affecting daily performance and overall well-being."
          description2="Understanding the causes of neck pain and adopting structured physiotherapy solutions can help individuals manage symptoms effectively and prevent long-term complications."
          image={{ src: "/blog-intro.jpg", alt: "blog introduction" }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

<div className="pt-5 md:pt-10">
      {post.id === "1" ? (
        <WhyChooseUs
          id="common-causes-neck-pain"
          eyebrow="Why Neck Pain is Common Among IT Professionals"
          title="Common Causes of Neck Pain in Desk Jobs"
          description="Sedentary routines, forward head posture, and workplace stress often contribute to muscle tension and cervical discomfort. Understanding these factors is the first step toward effective prevention and recovery."
          mdColumns={4}
          items={[
            {
              title: "Prolonged Sitting & Poor Posture",
              description:
                "Continuous screen use often leads to forward head posture, rounded shoulders, and increased strain on cervical muscles.",
              icon: Armchair,
            },
            {
              title: "Repetitive Work Movements",
              description:
                "Constant typing, mouse usage, and minimal movement throughout the day can create muscle tension and reduced joint mobility.",
              icon: MousePointer2,
            },
            {
              title: "Sedentary Lifestyle & Weak Muscles",
              description:
                "Limited physical activity weakens postural support muscles, especially in the neck, shoulders, and core.",
              icon: PersonStanding,
            },
            {
              title: "Stress & Mental Fatigue",
              description:
                "Work deadlines and mental pressure can cause unconscious muscle tightening, further increasing neck stiffness and discomfort.",
              icon: Brain,
            },
          ]}
        />
      ) : null}
</div>

<div className="pt-5 md:pt-10">
<KeyBenefits
        eyebrow="Symptoms"
        title="Common Symptoms to Watch"
        description="Early recognition of these symptoms can help prevent progression into chronic cervical conditions."
        bullets={[
          "Persistent neck stiffness or soreness",
          "Pain radiating to shoulders or upper back",
          "Reduced ability to turn or tilt the head",
          "Headaches originating from the base of the skull",
          "Tingling or numbness in arms or fingers",
          "Fatigue during prolonged computer work",
        ]}
        image={{ src: "/blog-symptoms.jpg", alt: "common symptoms" }}
        flipImageX={false}
      />
</div>

      {post.id === "1" ? (
        <>
          <section className="bg-white pt-10 md:pt-16">
            <div className="mx-auto max-w-[90vw] px-4">
              <div className="grid gap-10 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5 text-center md:text-left">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                    <Image
                      src="/sparkle.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    <span className="text-primary">How Helps</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Physiotherapy
                    <br />
                    Solutions for
                    <br />
                    Neck Pain
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-gray-500 md:mt-6">
                    Through guided treatment techniques, posture correction, and
                    strengthening exercises, physiotherapy helps relieve
                    stiffness, enhance flexibility, and support long-term neck
                    health for desk-based professionals.
                  </p>
                </div>

                <div className="md:col-span-7">
                  {[
                    {
                      title: "Pain Relief & Muscle Relaxation",
                      description:
                        "Manual therapy techniques, soft tissue mobilization, and therapeutic modalities help reduce muscle tightness and improve blood circulation. This provides immediate relief from discomfort and promotes tissue healing.",
                      icon: HandHeart,
                    },
                    {
                      title: "Posture Correction & Ergonomic Guidance",
                      description:
                        "Physiotherapists assess workplace posture and recommend ergonomic adjustments such as proper screen height, chair support, and desk positioning. These corrections reduce strain on neck structures during daily tasks.",
                      icon: LaptopMinimal,
                    },
                    {
                      title: "Strengthening & Mobility Exercises",
                      description:
                        "Targeted exercises improve neck stability, shoulder strength, and spinal alignment. Strengthening deep postural muscles helps maintain correct positioning and reduces the risk of recurring pain.",
                      icon: Dumbbell,
                    },
                    {
                      title: "Functional Movement Training",
                      description:
                        "Guided stretching and movement routines restore flexibility and joint mobility. Regular practice enhances endurance, allowing individuals to work comfortably for longer durations.",
                      icon: Footprints,
                    },
                  ].map((row, idx, arr) => (
                    <div key={row.title} className="py-3 md:py-4">
                      <div className="flex gap-5">
                        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-primary">
                          <row.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                            {row.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            {row.description}
                          </p>
                        </div>
                      </div>
                      {idx < arr.length - 1 ? (
                        <div className="mt-6 h-px w-full bg-gray-200" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white pb-16 pt-10 md:pb-20 md:pt-12">
            <div className="mx-auto max-w-[90vw] px-4 text-center md:text-left">
              <div className="h-px w-full bg-gray-200" />
              <h2 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 md:mt-12 md:text-5xl">
                Conclusion
              </h2>
              <div className="mt-6 max-w-7xl space-y-5 text-sm leading-6 text-gray-500 md:mt-7">
                <p>
                  Neck pain among IT professionals is a growing concern due to
                  sedentary work patterns and posture-related strain. However,
                  with early intervention, structured physiotherapy care, and
                  simple lifestyle modifications, individuals can effectively
                  manage pain and maintain healthy movement.
                </p>
                <p>
                  Prioritizing posture awareness, regular exercise, and
                  ergonomic practices not only supports physical well-being but
                  also enhances work efficiency and overall quality of life.
                </p>
              </div>
            </div>
          </section>
        </>
      ) : null}
      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Struggling with Neck or Back Pain at<br/> Work?"
        ctaDescription="Get expert physiotherapy guidance to improve posture, relieve discomfort, and restore comfortable daily<br/> movement."
      />
    </div>
  );
}
