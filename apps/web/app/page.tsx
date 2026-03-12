import { WhoCanJoin } from "../components/WhoCanJoin";
import { MovementCare } from "../components/MovementCare";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { MeetPhysiotherapist } from "../components/MeetPhysiotherapist";
import { ServicesSection } from "../components/ServicesSection";
import { MomentsOfProgress } from "../components/MomentsOfProgress";
import { FaqSection } from "../components/FaqSection";
import { AskPhysioSection } from "../components/AskPhysioSection";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div id="home" className="md:overflow-x-visible">
      <section className="bg-primary pt-20 rounded-b-3xl">
        <div className="mx-auto max-w-[90vw] px-4 pb-20 pt-10 md:pb-28 md:pt-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="text-white">
              <p className="text-sm/6 font-medium text-white/80">
                Physiotherapy • Posture • Rehab
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                Move better, feel better.
              </h1>
              <p className="mt-4 max-w-xl text-base/7 text-white/85">
                Evidence-based physiotherapy plans tailored for pain relief,
                strength, and long-term posture improvement.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#book-session"
                  className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition"
                >
                  Book Session
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
                >
                  View Services
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-[400px] rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </section>

      <WhoCanJoin />
      <MovementCare />
      <WhyChooseUs />
      <MeetPhysiotherapist />
      <ServicesSection />
      <MomentsOfProgress />
      <FaqSection />
      <AskPhysioSection />
      <Footer />
    </div>
  );
}
