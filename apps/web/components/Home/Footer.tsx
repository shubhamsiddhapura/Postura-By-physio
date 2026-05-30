"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";
import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";
import { scrollToHash } from "../../lib/scroll";

type FooterProps = {
  /** Small label above the CTA title */
  ctaEyebrow?: string | React.ReactNode;
  /** Main CTA title */
  ctaTitle?: string | React.ReactNode;
  /** Supporting CTA description */
  ctaDescription?: string | React.ReactNode;
};

function renderWithBr(value: string) {
  const parts = value.split(/<br\s*\/?>/i);
  return parts.map((part, idx) => (
    <span key={idx}>
      {part}
      {idx < parts.length - 1 ? <br /> : null}
    </span>
  ));
}

function renderTextOrNode(value: string | React.ReactNode) {
  return typeof value === "string" ? renderWithBr(value) : value;
}

export function Footer({
  ctaEyebrow = "Take Control of Your Health",
  ctaTitle = "Take the First Step Towards Better Health.",
  ctaDescription = "Schedule Your Appointment Easily via Call, WhatsApp or Online Form",
}: FooterProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const quickLinks: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Book a Session", href: "/book-a-session" },
    { label: "Patient Interaction", href: "/patient-interaction" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blogs", href: "/blogs" },
    { label: "Services", href: "/services" },
    // { label: "FAQs", href: "#faq" },
    { label: "Contact", href: "/contact-us" },
  ];

  /** Use `/#services` so from any page we navigate to Home’s services block (`#services` alone only affects the current URL). */
  const serviceLinks: Array<{ label: string; href: string }> = [
    { label: "Aerobics", href: "/aerobics-program" },
    { label: "Yoga", href: "/yoga-program" },
    { label: "Physiotherapy", href: "/physiotherapy" },
    { label: "Pilates", href: "/pilates-program" },
  ];

  return (
    <footer className="relative h-0 -z-20 bg-[#E5F7F6] -mt-44">
      {/* CTA Banner */}
      <div className="bg-[#E5F7F6] py-8 md:pt-72 pt-60">
        <div className="mx-auto max-w-[90vw] px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
            <FadeIn direction="up" duration={800} distance={30} delay={0} className="flex-1">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Image src="/orange-sparkle.svg" alt="Sparkle icon" width={16} height={16} className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {renderTextOrNode(ctaEyebrow)}
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-gray-900 md:text-4xl">
                  {renderTextOrNode(ctaTitle)}
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  {renderTextOrNode(ctaDescription)}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={180}>
              <PrimaryCTAButton
                href="https://wa.me/916354011290"
                label="Connect Now"
                size="md"
                className="cursor-pointer"
                arrowVariant="dark"
              />
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="bg-[#E5F7F6] md:pt-10 pt-4">
        <div className="w-[90vw] h-[1px] bg-[#D9D9D9] mx-auto" />
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#E5F7F6] py-12 md:py-16">
        <div className="mx-auto max-w-[90vw] px-4">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Left Column - Brand and Social */}
            <FadeIn direction="up" duration={800} distance={30} delay={0} className="md:col-span-4">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Postura by Physio logo"
                  width={150}
                  height={5}
                  priority
                  className="h-14 w-auto object-contain"
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-[#6B6B6B]">
                Helping you prevent pain, recover safely, and perform better
                with expert-led physiotherapy and fitness programs delivered at
                your home, society, or online.
              </p>

              <div className="mt-10">
                <h4 className="text-sm font-semibold text-primary">
                  Follow for More Health Tips
                </h4>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href="https://www.instagram.com/postura_by_physio?igsh=MTk0NGNyZ3htY3U1Zg=="
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary text-secondary transition hover:bg-secondary hover:text-white"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/dr-priyanshi-pandya-pt-b91133217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary text-secondary transition hover:bg-secondary hover:text-white"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            </FadeIn>

            {/* Middle Columns - Quick Links and Services */}
            <FadeIn direction="up" duration={800} distance={30} delay={150} className="md:col-span-4">
            <div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Quick links
                  </h4>
                  <ul className="mt-4 space-y-2">
                    {quickLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={(e) => {
                            if (!isHome) return;
                            if (!link.href.startsWith("#")) return;
                            e.preventDefault();
                            scrollToHash(link.href, { extraOffsetPx: 12 });
                          }}
                          className="text-sm text-gray-600 transition hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Our Services
                  </h4>
                  <ul className="mt-4 space-y-2">
                    {serviceLinks.map((service) => (
                      <li key={service.label}>
                        <Link
                          href={service.href}
                          prefetch
                          className="text-sm text-gray-600 transition hover:text-primary"
                        >
                          {service.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            </FadeIn>

            {/* Right Column - Contact Info */}
            <FadeIn direction="up" duration={800} distance={30} delay={300} className="md:col-span-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                Contact Info
              </h4>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Whatsapp / Phone no.
                  </p>
                  <a
                    href="tel:+916354011290"
                    className="mt-1 block text-lg font-semibold text-secondary transition hover:opacity-80"
                  >
                    +91 63540 11290
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </p>
                  <a
                    href="mailto:posturabyphysio@gmail.com"
                    className="mt-1 block text-lg font-semibold text-secondary transition hover:opacity-80"
                  >
                    posturabyphysio@gmail.com
                  </a>
                </div>
              </div>
            </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="bg-[#E5F7F6]">
        <div className="w-[90vw] h-[1px] bg-[#D9D9D9] mx-auto" />
      </div>

      {/* Copyright Bar */}
      <div className="py-4 bg-[#E5F7F6]">
        <div className="mx-auto max-w-[90vw] px-4">
          <FadeIn direction="up" duration={700} distance={20} delay={0}>
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#6B6B6B] md:flex-row">
            
            <p>
                Design and Develop by{" "}
                <Link
                  href="https://codenixlabs.com"
                  className="font-semibold text-secondary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Codenix Labs
                </Link>
              </p>
              <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
              <p>
                © 2026{" "}
                <span className="font-semibold text-secondary">
                  Postura by Physio
                </span>
                . All Rights Reserved.
              </p>
              
            </div>
            <div className="flex items-center flex-wrap justify-center md:justify-start md:gap-4 gap-2">
              <Link
                href="/privacy-policy"
                className="transition hover:text-secondary"
              >
                Privacy Policy
              </Link>
              <span>|</span>
              <Link
                href="/terms-and-conditions"
                className="transition hover:text-secondary"
              >
                Terms & Condition
              </Link>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </footer>
  );
}
