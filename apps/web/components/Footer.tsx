import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { PrimaryCTAButton } from "./PrimaryCTAButton";

export function Footer() {
  return (
    <footer className="relative h-0 -z-20 bg-[#E5F7F6] -mt-44">
      {/* CTA Banner */}
      <div className="bg-[#E5F7F6] py-8 md:pt-72">
        <div className="mx-auto max-w-[90vw]">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rotate-45 bg-secondary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Take Control of Your Health
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 md:text-4xl">
                Take the First Step Towards Better Health.
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Schedule Your Appointment Easily via Call, WhatsApp or Online
                Form
              </p>
            </div>

            <PrimaryCTAButton
              href="#book-session"
              label="Whatsapp Now"
              size="md"
              className="pr-8 cursor-pointer"
            />
          </div>
        </div>
      </div>

<div className="bg-[#E5F7F6] pt-10">
      <div className="w-[90vw] h-[1px] bg-[#D9D9D9] mx-auto"/>
</div>

      {/* Main Footer Content */}
      <div className="bg-[#E5F7F6] py-12 md:py-16">
        <div className="mx-auto max-w-[90vw] px-4">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Left Column - Brand and Social */}
            <div className="md:col-span-4">
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
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary hover:bg-secondary hover:text-white text-secondary hover:opacity-90"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary text-secondary transition hover:bg-secondary hover:text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary text-secondary transition hover:bg-secondary hover:text-white"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border-[1px] border-secondary text-secondary transition hover:bg-secondary hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Middle Columns - Quick Links and Services */}
            <div className="md:col-span-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Quick links
                  </h4>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Home",
                      "About",
                      "Services",
                      "FAQs",
                      "Health Tips",
                      "Contact",
                    ].map((link) => (
                      <li key={link}>
                        <Link
                          href={`#${link.toLowerCase().replace(" ", "-")}`}
                          className="text-sm text-gray-600 transition hover:text-primary"
                        >
                          {link}
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
                    {["Aerobics", "Yoga", "Physiotherapy", "Pilates"].map(
                      (service) => (
                        <li key={service}>
                          <Link
                            href="#services"
                            className="text-sm text-gray-600 transition hover:text-primary"
                          >
                            {service}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="md:col-span-4">
              <h4 className="text-xl font-semibold text-gray-900">
                Contact Info
              </h4>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Whatsapp / Phone no.
                  </p>
                  <a
                    href="tel:+91635401290"
                    className="mt-1 block text-lg font-semibold text-secondary transition hover:opacity-80"
                  >
                    +91 635401290
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
          </div>
        </div>
      </div>

      <div className="bg-[#E5F7F6]">
      <div className="w-[90vw] h-[1px] bg-[#D9D9D9] mx-auto"/>
</div>

      {/* Copyright Bar */}
      <div className="py-4 bg-[#E5F7F6]">
        <div className="mx-auto max-w-[90vw]">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#6B6B6B] md:flex-row">
            <p>© 2026 <span className="font-semibold text-secondary">Postura by Physio</span>. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="transition hover:text-secondary"
              >
                Privacy Policy
              </Link>
              <span>|</span>
              <Link
                href="#"
                className="transition hover:text-secondary"
              >
                Terms & Condition
              </Link>
              <span>|</span>
              <Link
                href="#"
                className="transition hover:text-secondary"
              >
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
