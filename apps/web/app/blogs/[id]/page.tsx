import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, User } from "lucide-react";
import { Footer } from "../../../components/Home/Footer";
import { WhyChooseUs } from "../../../components/Home/WhyChooseUs";
import { CommonChallenges } from "@/components/Common/CommonChallenges";
import { KeyBenefits } from "@/components/Common/KeyBenefits";
import { getBlogByIdOrSlug } from "@/lib/blogs";
import { iconFor } from "@/lib/icons";
import JsonLd from "@/components/JsonLd";

const heroTeal = "#007575";
const SITE_URL = "https://www.posturabyphysio.com";
const SITE_NAME = "Postura by Physio";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getBlogByIdOrSlug(params.id);
  if (!post) {
    return {
      title: "Article",
      alternates: { canonical: `${SITE_URL}/blogs/${encodeURIComponent(params.id)}` },
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/blogs/${encodeURIComponent(params.id)}`;
  const description = post.excerpt.slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      images: [
        {
          url: post.imageSrc,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.imageSrc],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = params;
  const post = await getBlogByIdOrSlug(id);
  if (!post) notFound();

  const canonical = `${SITE_URL}/blogs/${encodeURIComponent(id)}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt?.slice(0, 160),
    image: post.imageSrc ? [post.imageSrc] : undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : undefined,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/admin-logo.png`,
      },
    },
  };

  // Build the causes items for WhyChooseUs, mapping the stored icon name
  // to the actual Lucide component.
  const causesItems =
    post.causesItems?.map((item) => ({
      title: item.title,
      description: item.description,
      icon: iconFor(item.icon),
    })) ?? [];

  const hasCauses =
    causesItems.length > 0 &&
    Boolean(post.causesEyebrow && post.causesTitle && post.causesDescription);

  const hasSolutions =
    (post.solutionsItems?.length ?? 0) > 0 &&
    Boolean(
      post.solutionsEyebrow && post.solutionsTitle && post.solutionsDescription
    );

  const hasConclusion = post.conclusionParagraphs.length > 0;
  const conclusionHeading = post.conclusionTitle ?? "Conclusion";

  return (
    <div>
      <JsonLd data={articleSchema} />
      {/* Hero: teal panel + overlapping image */}
      <section className="relative pb-0">
        <div
          className="relative overflow-hidden rounded-br-[clamp(3rem,12vw,7.5rem)] rounded-bl-3xl pb-[clamp(8rem,22vw,14rem)] flex items-center pt-10 md:pt-14 h-[90vh] md:h-[62vh] lg:h-screen"
          style={{ backgroundColor: heroTeal }}
        >
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="mx-auto w-full min-[480px]:w-[92%] sm:w-[88%] md:w-[86%] lg:w-[90%] xl:w-full text-center md:text-left">
              <p className="flex items-center gap-2 md:text-sm text-xs font-medium text-[#FEF9E0] justify-center md:justify-start">
                <span>✦</span>
                {post.eyebrow}
              </p>

              <h1 className="mt-4 max-w-4xl font-cabinet text-[40px] font-bold leading-tight tracking-tight md:text-5xl md:leading-[1.15] lg:text-6xl lg:leading-[1.15] text-[#FEF9E0]">
                {post.title}
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-20 md:gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3 flex-col md:flex-row">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg md:h-11 md:w-11 bg-[#FEF9E0]">
                    <Calendar
                      className="h-6 w-6 md:h-5 md:w-5"
                      style={{ color: heroTeal }}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  <span className="font-medium md:text-base text-[#FEF9E0]">
                    {post.date}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-col md:flex-row">
                  <span className="grid h-12  w-12 shrink-0 place-items-center rounded-lg md:h-11 md:w-11 bg-[#FEF9E0]">
                    <User
                      className="h-6 w-6 md:h-5 md:w-5"
                      style={{ color: heroTeal }}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  <span className="font-medium md:text-base text-[#FEF9E0]">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto md:-mt-60 -mt-40 max-w-7xl px-4">
          <div className="relative mx-auto h-[300px] md:h-[580px] w-full min-[480px]:w-[92%] sm:w-[88%] md:w-[86%] lg:w-[90%] xl:w-full overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-tr-[84px] rounded-bl-[84px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
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

      {/* Introduction */}
      <div className="pt-10 md:pt-20">
        <CommonChallenges
          eyebrow={post.introEyebrow}
          title={post.introTitle}
          description={post.introDescription}
          description2={post.introDescription2 ?? undefined}
          image={{
            src: post.introImageSrc,
            alt: post.introImageAlt ?? post.introTitle,
          }}
          watermarkSrc="/logo-svg.png"
        />
      </div>

      {/* Causes (optional) */}
      {hasCauses ? (
        <div className="pt-5 md:pt-10">
          <WhyChooseUs
            id="common-causes"
            eyebrow={post.causesEyebrow ?? undefined}
            title={post.causesTitle ?? undefined}
            description={post.causesDescription ?? undefined}
            mdColumns={(post.causesColumns as 2 | 3 | 4) ?? 4}
            items={causesItems}
          />
        </div>
      ) : null}

      {/* Symptoms */}
      <div className="pt-5 md:pt-10">
        <KeyBenefits
          eyebrow={post.symptomsEyebrow}
          title={post.symptomsTitle}
          description={post.symptomsDescription}
          bullets={post.symptomsBullets}
          image={{
            src: post.symptomsImageSrc,
            alt: post.symptomsImageAlt ?? post.symptomsTitle,
          }}
          flipImageX={post.symptomsFlipImage}
        />
      </div>

      {/* Solutions (optional) */}
      {hasSolutions ? (
        <section className="bg-white pt-10 md:pt-16">
          <div className="mx-auto max-w-[90vw] px-4">
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-5 text-center md:text-left">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                  <Image
                    src="/sparkle.svg"
                    alt="Sparkle icon"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <span className="text-primary">{post.solutionsEyebrow}</span>
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl whitespace-pre-line">
                  {post.solutionsTitle}
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-500 md:mt-6">
                  {post.solutionsDescription}
                </p>
              </div>

              <div className="md:col-span-7">
                {post.solutionsItems?.map((row, idx, arr) => {
                  const Icon = iconFor(row.icon);
                  return (
                    <div key={`${row.title}-${idx}`} className="py-3 md:py-4">
                      <div className="flex gap-5">
                        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-primary">
                          <Icon className="h-5 w-5 text-white" />
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
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Conclusion (optional) */}
      {hasConclusion ? (
        <section className="bg-white pb-16 pt-10 md:pb-20 md:pt-12">
          <div className="mx-auto max-w-[90vw] px-4 text-center md:text-left">
            <div className="h-px w-full bg-gray-200" />
            <h2 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 md:mt-12 md:text-5xl">
              {conclusionHeading}
            </h2>
            <div className="mt-6 max-w-7xl space-y-5 text-sm leading-6 text-gray-500 md:mt-7">
              {post.conclusionParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Struggling with Neck or Back Pain at<br/> Work?"
        ctaDescription="Get expert physiotherapy guidance to improve posture, relieve discomfort, and restore comfortable daily<br/> movement."
      />
    </div>
  );
}
