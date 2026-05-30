import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import Image from "next/image";
import { FadeIn } from "../../components/ui/FadeIn";
import { ArrowUpRight } from "lucide-react";
import { getPublishedBlogs } from "@/lib/blogs";
import BlogsGrid from "./BlogsGrid.client";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read Postura Insights—physiotherapy guidance, rehabilitation tips, posture care, and preventive wellness articles to help you move better and recover safely.",
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    title: "Postura Insights (Blogs)",
    description:
      "Physiotherapy guidance, rehabilitation tips, posture care, and preventive wellness articles to help you move better and recover safely.",
    url: `${SITE_URL}/blogs`,
    images: [{ url: "/blog-hero.png", width: 1200, height: 630, alt: "Postura Insights" }],
  },
};

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

export default async function BlogsPage() {
  const blogPosts = await getPublishedBlogs();

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
                  alt="Sparkle icon"
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

          <BlogsGrid posts={blogPosts} initialCount={6} step={6} />
        </section>
      </main>

      <Footer
        ctaEyebrow="Take Control of Your Health"
        ctaTitle="Struggling with Neck or Back Pain at<br/> Work?"
        ctaDescription="Get expert physiotherapy guidance to improve posture, relieve discomfort, and restore comfortable daily<br/> movement."
      />
    </div>
  );
}
