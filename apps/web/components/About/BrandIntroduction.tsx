import Image from "next/image";
import type React from "react";
import { FadeIn } from "../ui/FadeIn";

export type BrandIntroductionImage = {
    src: string;
    alt: string;
};

export type BrandIntroductionProps = {
    eyebrow?: string;
    title?: string;
    description?: React.ReactNode;
    paragraph1?: string;
    highlight?: string;
    image1?: BrandIntroductionImage;
    image2?: BrandIntroductionImage;
};

export function BrandIntroduction({
    eyebrow = "Brand Introduction",
    title = "Professional Care for Stronger Movement",
    description = (
        <>
            Under the direction of <strong>Dr. Priyanshi Pandya (MPT, MIAFT)</strong>, Postura by Physio provides
            professional physiotherapy and fitness care with an emphasis on posture correction, movement
            improvement, and long-term wellness.
        </>
    ),
    paragraph1 = `We offer personalized care for orthopedic, neurological, geriatric, women's health, and lifestyle-related conditions. Our treatment approach combines evidence-based physiotherapy with guided fitness programs to ensure safe recovery and sustainable health improvement.`,
    highlight = `At Postura, our goal is simple — help you move better, feel stronger, and live a healthier life.`,
    image1 = { src: "/bi-1.jpg", alt: "Physiotherapy session" },
    image2 = { src: "/bi-2.jpg", alt: "Posture correction session" },
}: BrandIntroductionProps) {
    const hasHighlight = highlight.trim().length > 0;

    return (
        <section id="brand-introduction" className="bg-white">
            <div className="mx-auto max-w-[90vw] md:px-4 py-16 md:py-20">
                <div className="grid md:gap-10 gap-3 md:grid-cols-[1fr,1.15fr] md:items-end text-center md:text-left">
                    <FadeIn direction="up" distance={32} duration={800} delay={0}>
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 justify-center md:justify-start">
                                <Image src="/sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                                <span className="text-primary">{eyebrow}</span>
                            </div>
                            <h2 className="mt-3 md:text-5xl text-3xl font-bold tracking-tight text-gray-900">
                                {title}
                            </h2>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={120} className="md:justify-self-end">
                        <p className="max-w-2xl text-sm leading-6 text-gray-500 md:mt-2">
                            {description}
                        </p>
                    </FadeIn>
                </div>

                <div className="md:mt-16 mt-10 grid gap-8 md:grid-cols-3 md:items-end text-center md:text-left">
                    <FadeIn direction="up" delay={160}>
                        <div className="flex h-full flex-col md:pr-6 min-w-0">
                            <p className="max-w-md text-sm leading-6 text-gray-500">
                                {paragraph1}
                            </p>

                            {hasHighlight && (
                                <p className="md:mt-10 mt-6 max-w-md text-lg font-semibold leading-7 text-primary">
                                    {highlight}
                                </p>
                            )}
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={220} className="md:col-span-1">
                        <div className="relative overflow-hidden rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl ring-1 ring-black/5 min-w-0">
                            <div className="aspect-[16/10] w-full md:aspect-[15/10]">
                                <Image
                                    src={image1.src}
                                    alt={image1.alt}
                                    fill
                                    priority={false}
                                    sizes="(min-width: 768px) 33vw, 90vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={280}>
                        <div className="relative overflow-hidden rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl ring-1 ring-black/5 min-w-0 w-full md:max-w-[360px] lg:max-w-[400px] md:ml-auto">
                            <div className="aspect-[4/5] w-full">
                                <Image
                                    src={image2.src}
                                    alt={image2.alt}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 30vw, 90vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
