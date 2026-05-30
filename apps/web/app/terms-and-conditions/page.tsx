import type { Metadata } from "next";
import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { CheckCheckIcon } from "lucide-react";
import { FadeIn } from "../../components/ui/FadeIn";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the service policies, booking conditions, and client responsibilities for Postura by Physio physiotherapy and wellness programs.",
  alternates: { canonical: `${SITE_URL}/terms-and-conditions` },
};

const termsSlides = [
  {
    src: "/t&c.png",
    mobileSrc: "/t&c.png",
    alt: "Terms and Conditions",
    tag: "Terms and Conditions",
    headline: "Guidelines for Safe &<br/> Professional Care",
    body: "Our terms outline service policies, booking conditions, and client responsibilities to maintain quality healthcare delivery and transparency.",
    sub: "",
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-left text-sm text-gray-600 md:mt-6 mx-auto w-full max-w-2xl md:mx-0 md:max-w-none">
      {items.map((b, idx) => (
        <li key={`${idx}-${b}`} className="flex gap-3 justify-start">
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

export default function TermsAndConditionsPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection
        slides={termsSlides}
        id="terms-and-conditions-hero"
        heightClassName="h-[80vh]"
        showBookSessionButton
        bookSessionButtonPlacement="right"
      />

      <main className="bg-white">
        <div className="mx-auto px-4 py-12 md:max-w-5xl md:py-16 text-center md:text-left">
          <FadeIn direction="up" duration={850} distance={30} delay={0}>
            <section>
              <h2 className="font-semibold text-gray-900 text-2xl">Introduction</h2>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Welcome to Postura by Physio. By accessing our website, booking
                our services, or participating in our physiotherapy and wellness
                programs, you agree to comply with and be bound by the following
                Terms & Conditions.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                These terms are designed to ensure safe service delivery,
                professional conduct, and a transparent experience for all
                clients.
              </p>
              <div className="mt-8 h-px w-full bg-[#EDEDED]" />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-10">
              <h2 className="text-2xl font-semibold text-gray-900">
                Service Scope
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Postura by Physio provides physiotherapy rehabilitation, fitness
                training programs, wellness sessions, and consultation services.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                All programs are designed based on professional assessment and
                may vary depending on individual health conditions, fitness
                levels, and recovery requirements.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Participation in any program is voluntary and subject to
                professional evaluation and guidance.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Appointment & Booking Policy
              </h2>
              <BulletList
                items={[
                  "Appointments should be scheduled in advance through our website, phone, or authorized communication channels.",
                  "Clients are requested to provide accurate personal and health-related information for safe treatment planning.",
                  "Timely arrival for scheduled sessions is recommended to ensure complete treatment duration.",
                  "Postura by Physio reserves the right to reschedule appointments due to unavoidable circumstances.",
                ]}
              />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Health & Safety Responsibility
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Clients must inform the therapist about:
              </p>
              <BulletList
                items={[
                  "Existing medical conditions",
                  "Recent surgeries or injuries",
                  "Pregnancy or post-delivery status",
                  "Any discomfort experienced during sessions",
                ]}
              />
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Following therapist instructions during exercises or
                rehabilitation sessions is essential to prevent injury or health
                complications.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment Terms
              </h2>
              <BulletList
                items={[
                  "Service fees must be paid as per the agreed consultation or program package.",
                  "Payment methods may include online transfer, digital payment, or other accepted modes.",
                  "Fees once paid may be non-refundable unless otherwise specified in a separate cancellation or refund policy.",
                ]}
              />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Cancellation & Rescheduling
              </h2>
              <BulletList
                items={[
                  "Clients should inform at least 24 hours in advance for cancellation or rescheduling of sessions.",
                  "Missed sessions without prior notice may be considered as completed sessions.",
                  "Postura by Physio may reschedule sessions due to therapist availability or operational reasons.",
                ]}
              />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Results & Recovery Disclaimer
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Physiotherapy and fitness outcomes vary from person to person
                depending on health condition, participation consistency, and
                lifestyle habits.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Postura by Physio does not guarantee specific results but
                ensures professional guidance and evidence-based treatment
                practices.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Website Usage
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                All content on this website, including text, graphics, and
                program details, is for informational purposes only. Unauthorized
                copying, reproduction, or misuse of website content is
                prohibited.
              </p>
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Limitation of Liability
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Postura by Physio shall not be held responsible for:
              </p>
              <BulletList
                items={[
                  "Injuries caused due to non-compliance with professional guidance",
                  "Health issues arising from undisclosed medical conditions",
                  "Service interruptions caused by technical or external factors",
                ]}
              />
            </section>
          </FadeIn>

          <FadeIn direction="up" duration={850} distance={30} delay={80}>
            <section className="pt-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Policy Updates
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                These Terms & Conditions may be updated periodically to reflect
                service changes, legal requirements, or operational improvements.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Users are encouraged to review this page regularly.
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

      <Footer ctaEyebrow="Take Control of Your Health" ctaTitle="Don’t Let Pain Affect Your Productivity" ctaDescription="Start a structured recovery plan designed to help you move better, stay active, and work with confidence." />
    </div>
  );
}

