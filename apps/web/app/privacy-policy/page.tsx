import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CheckCheckIcon } from "lucide-react";
import { FadeIn } from "../../components/ui/FadeIn";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Postura by Physio collects, uses, and protects your personal information when you use our website or book physiotherapy services.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

const privacySlides = [
  {
    src: "/pp-hero.png",
    mobileSrc: "/pp-hero.png",
    alt: "Privacy Policy",
    tag: "Privacy Policy",
    headline: "Protecting Your</br> Information with Care",
    body: "Our privacy practices are designed to maintain trust, ensure data security, and provide a safe online experience for all our clients.",
    sub: "",
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-left text-sm text-gray-600 md:mt-6 mx-auto w-full max-w-2xl md:mx-0 md:max-w-none">
      {items.map((b, idx) => (
        <li key={`${idx}-${b}`} className="flex gap-3">
          <span
            className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary"
            aria-hidden="true"
          >
            <CheckCheckIcon className="h-4 w-4 text-white" />
          </span>
          <span className="text-left">{b}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection
        slides={privacySlides}
        id="privacy-policy-hero"
        heightClassName="h-[80vh]"
        showBookSessionButton
        bookSessionButtonPlacement="right"
      />

      <main className="bg-white">
        <div className="mx-auto px-4 py-12 md:max-w-6xl md:py-16 text-center md:text-left">
          <FadeIn direction="up" duration={850} distance={30} delay={0}>
            <section>
              <h2 className="font-semibold text-gray-900 text-2xl">Introduction</h2>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                At Postura by Physio, we are committed to protecting your personal information and respecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard the information you provide while using our website and physiotherapy services.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                By accessing our website or booking our services, you agree to the terms outlined in this policy.
              </p>
              <div className="mt-8 h-px w-full bg-[#EDEDED]" />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-10">
              <h2 className="text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                We may collect personal information that you voluntarily provide
                when you:
              </p>

              <BulletList
                items={[
                  "Fill out contact or appointment forms",
                  "Book physiotherapy or fitness sessions",
                  "Subscribe to updates or wellness programs",
                  "Communicate with us via phone, email, or social media",
                ]}
              />
              <p className="mt-4 text-sm text-gray-500">
                This information may include:
              </p>
              <BulletList
                items={[
                  "Full name",
                  "Contact number",
                  "Email address",
                  "Location details",
                  "Health concerns or treatment requirements",
                  "Appointment preferences",
                ]}
              />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your information is used only for healthcare service purposes,
                including:
              </p>
              <BulletList
                items={[
                  "Scheduling and managing appointments",
                  "Providing personalized physiotherapy and wellness programs",
                  "Responding to inquiries and customer support requests",
                  "Improving our services and website experience",
                  "Sharing important updates related to health programs or sessions",
                ]}
              />
              <p className="mt-4 text-sm leading-6 text-gray-500">
                We ensure that your personal and medical information is handled
                with professional confidentiality.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Information Sharing & Disclosure
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Postura by Physio does not sell, rent, or trade your personal
                information to third parties.
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Information may be shared only when necessary for:
              </p>
              <BulletList
                items={[
                  "Providing healthcare services",
                  "Legal or regulatory requirements",
                  "Technical website maintenance by authorized service providers",
                ]}
              />
              <p className="mt-4 text-sm leading-6 text-gray-500">
                All such parties are required to maintain strict data
                confidentiality.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                We implement appropriate technical and administrative measures
                to protect your personal information from unauthorized access,
                misuse, or disclosure.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                While we strive to safeguard your data, no online platform can
                guarantee complete security.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Cookies & Website Usage
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Our website may use cookies or basic analytics tools to improve
                user experience, understand website performance, and enhance
                service delivery.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                You may choose to disable cookies through your browser settings
                if preferred.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Rights
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                You have the right to:
              </p>
              <BulletList
                items={[
                  "Request access to your personal information",
                  "Ask for corrections or updates",
                  "Request deletion of your data where applicable",
                  "Opt out of marketing or promotional communication",
                ]}
              />
              <p className="mt-4 text-sm leading-6 text-gray-500">
                To make such requests, you may contact us using the details
                below.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Updates to This Policy
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Postura by Physio may update this Privacy Policy from time to
                time to reflect changes in services, legal requirements, or
                website functionality.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                We encourage users to review this page periodically.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                For any questions regarding these Terms & Conditions, please
                contact:
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone no.
                  </p>
                  <a
                    href="tel:+916354011290"
                    className="mt-2 block text-sm font-semibold text-gray-900"
                  >
                    +91 6354011290
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </p>
                  <a
                    href="mailto:posturabyphysio@email.com"
                    className="mt-2 block text-sm font-semibold text-gray-900"
                  >
                    posturabyphysio@email.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Vadodara, Gujarat
                  </p>
                </div>
              </div>
            </section>
          </FadeIn>
        </div>
      </main>

      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Ready to Improve Your Posture & Mobility?" ctaDescription="Our personalized physiotherapy programs help reduce stiffness, build strength, and prevent recurring pain." />
    </div>
  );
}

