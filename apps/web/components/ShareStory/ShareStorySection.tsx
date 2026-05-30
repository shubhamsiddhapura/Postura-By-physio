"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { ShareStoryForm } from "./ShareStoryForm";

const CONTACT_PHONE_DISPLAY = "+91 6354011290";
const CONTACT_PHONE_TEL = "+916354011290";
const CONTACT_EMAIL = "posturabyphysio@email.com";
const LOCATION = "Vadodara, Gujarat";

/**
 * Two-column layout used by the public `/share-your-story` page:
 *   - Left:  the testimonial submission form (`ShareStoryForm`)
 *   - Right: a compact sidebar with an "About Postura" blurb, contact
 *           info, and a short note explaining what happens after the
 *           patient submits.
 *
 * Design language matches the rest of the site (rounded asymmetric
 * `bg-[#fafafa]` cards, primary-coloured eyebrow + sparkle icon).
 */
export function ShareStorySection() {
  return (
    <section
      id="share-your-story"
      className="relative bg-white py-12 md:py-20"
    >
      <div className="mx-auto w-[92vw] max-w-7xl">
        <FadeIn direction="up" duration={800} distance={26} delay={0}>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
              <Image
                src="/sparkle.svg"
                alt="Sparkle icon"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span className="text-primary">Tell Us Your Experience</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Share Your Healing Journey
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
              Fill in a few details, attach a photo or short video if you
              like, and your story will help someone else find the courage
              to start theirs.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.25fr,0.85fr] md:items-start md:gap-12">
          <FadeIn direction="up" duration={800} distance={26} delay={80}>
            <ShareStoryForm />
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={26} delay={160}>
            <Sidebar />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <aside className="space-y-6">
      <div className="rounded-tl-[36px] rounded-br-[36px] rounded-bl-[12px] rounded-tr-[12px] bg-[#fafafa] p-6 md:p-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-primary">About Postura by Physio</span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-gray-900 md:text-2xl">
          Care led by Dr. Priyanshi Pandya
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Postura by Physio is a Vadodara-based physiotherapy and wellness
          practice focused on posture, recovery, and prevention. We
          combine evidence-based physiotherapy with structured fitness
          programs so you can move better, feel stronger, and stay
          pain-free for the long run.
        </p>
      </div>

      <div className="rounded-tl-[36px] rounded-br-[36px] rounded-bl-[12px] rounded-tr-[12px] bg-[#fafafa] p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
          Reach Us Anytime
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Questions before you submit? We&rsquo;re happy to help.
        </p>

        <ul className="mt-6 space-y-5">
          <li className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-primary ring-1 ring-primary/20">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone / WhatsApp
              </p>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="mt-0.5 block text-sm font-semibold text-gray-900 transition hover:text-primary"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-primary ring-1 ring-primary/20">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-0.5 break-all text-sm font-semibold text-gray-900">
                {CONTACT_EMAIL}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-primary ring-1 ring-primary/20">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Location
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {LOCATION}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-xs leading-5 text-gray-700">
          <p className="font-semibold text-gray-900">
            What happens after you submit?
          </p>
          <p className="mt-1 text-gray-600">
            Our team reviews each story before it&rsquo;s published, so your
            words and any photos or videos appear exactly as you intend.
            We&rsquo;ll never share your contact details — only the parts of
            your story you choose to publish.
          </p>
        </div>
      </div>
    </aside>
  );
}
