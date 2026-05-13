import { HeroSection } from "../components/Home/HeroSection";
import { WhoCanJoin } from "../components/Home/WhoCanJoin";
import { MovementCare } from "../components/Home/MovementCare";
import { WhyChooseUs } from "../components/Home/WhyChooseUs";
import { MeetPhysiotherapist } from "../components/Home/MeetPhysiotherapist";
import { ServicesSection } from "../components/Home/ServicesSection";
import { MomentsOfProgress } from "../components/Home/MomentsOfProgress";
import { FaqSection } from "../components/Home/FaqSection";
import { RecoveryResultsBanner } from "../components/Home/RecoveryResultsBanner";
import { AskPhysioSection } from "../components/Home/AskPhysioSection";
import { Footer } from "../components/Home/Footer";

export default function HomePage() {
  return (
    <div id="home" className="md:overflow-x-visible">
      <HeroSection />
      <WhoCanJoin />
      <MovementCare />
      <WhyChooseUs />
      <MeetPhysiotherapist />
      <ServicesSection />
      <MomentsOfProgress />
      <FaqSection />
      <RecoveryResultsBanner />
      <AskPhysioSection />
      <Footer />
    </div>
  );
}
