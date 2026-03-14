"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FadeIn } from "../ui/FadeIn";

const slides = [
  {
    src: "/hero-1.png",
    mobileSrc: "/responsive-banner-1.png",
    alt: "Wrong Posture",
    tag: "Correct Your Posture with Postura by Physio",
    headline: "A Wrong Posture and Stiff Muscles Can Lead to Big Problems",
    body: "Small daily habits create long-term consequences. Poor posture and tight muscles silently reduce productivity, increase fatigue, and cause chronic pain.",
    sub: "Start correcting today for a stronger tomorrow.",
  },
//   {
//     src: "/hero-2.png",
//     mobileSrc: "/responsive-banner-2.png",
//     alt: "Doorstep Care",
//     tag: "Convenience Meets Care",
//     headline: "Professional Care.<br/> Right at Your </br> Doorstep.",
//     body: "No travel. No waiting rooms.",
//     sub: "We bring expert physiotherapy sessions to your home, society, or even online so your recovery fits into your life.",
//   },
  {
    src: "/hero-3.png",
    mobileSrc: "/responsive-banner-3.png",
    alt: "Total Mobility",
    tag: "Fitness | Rehab | Prevention",
    headline: "Every Muscle & Joint <br/> Matters. Complete <br/> Body Care.",
    body: "Professional physiotherapy and structured fitness programs designed to improve posture, movement, and long-term wellness.",
    sub: "",
  },
];

const AUTOPLAY_INTERVAL = 4000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goTo = (index: number) => setCurrent(index);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen overflow-hidden rounded-br-[100px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Mobile background image (below md) */}
          <Image
            src={slide.mobileSrc}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-top md:hidden"
            sizes="100vw"
          />

          {/* Desktop background image (md and above) */}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-center hidden md:block"
            sizes="100vw"
          />

          {/* Text Content */}
          <div className="absolute bottom-24 left-0 right-0 md:bottom-auto md:top-60 flex flex-col px-6 md:px-16 lg:px-24 md:max-w-3xl">
            {/* Tag */}
            <FadeIn direction="up" distance={30} duration={800} delay={0}>
              <p className="flex items-center gap-2 text-sm font-medium text-[#FEF9E0] mb-4 md:mb-5 justify-center md:justify-start">
                <span>✦</span>
                {slide.tag}
              </p>
            </FadeIn>

            {/* Headline */}
            <FadeIn direction="up" distance={30} duration={800} delay={150}>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FEF9E0] leading-tight mb-4 md:mb-5 text-center md:text-left"
                dangerouslySetInnerHTML={{ __html: slide.headline }}
              />
            </FadeIn>

            {/* Body */}
            <FadeIn direction="up" distance={30} duration={800} delay={300}>
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-2 md:mb-3 text-center md:text-left">
                {slide.body}
              </p>
            </FadeIn>

            {/* Sub */}
            {slide.sub && (
              <FadeIn direction="up" distance={30} duration={800} delay={450}>
                <p className="text-sm md:text-base text-white/90 leading-relaxed text-center md:text-left">
                  {slide.sub}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <FadeIn
        direction="up"
        distance={20}
        duration={800}
        delay={600}
        className="absolute bottom-8 left-36 md:left-16 lg:left-24 z-20"
      >
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-full px-3 py-2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
