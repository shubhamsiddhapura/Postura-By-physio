import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";

const PROGRAM_TAGS = [
  "Postural Correction Program",
  "Orthopedic Rehabilitation",
  "Cardio-Respiratory Rehabilitation",
  "Women's Health Physiotherapy",
  "Geriatric Rehabilitation",
  "Neurological rehabilitation",
] as const;

type RecommendedProgramSectionProps = {
  /** Patient-interaction page: open health summary modal instead of navigating. */
  onBookSessionClick?: () => void;
};

export function RecommendedProgramSection({ onBookSessionClick }: RecommendedProgramSectionProps) {
  return (
    <section className="bg-white pb-10 md:pb-20">
      <div className="mx-auto max-w-[90vw] md:px-4 border-t border-gray-200 py-10">
        <FadeIn direction="up" distance={28} duration={800} delay={0}>
          <div className="rounded-tl-[48px] rounded-br-[48px] rounded-bl-[18px] rounded-tr-[18px] border-2 border-primary bg-[#E5F7F6] px-6 py-10 text-center md:px-12 md:py-14">
            <h2 className="text-2xl font-bold text-primary md:text-4xl">
              Recommended Program for You
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-primary/70 md:text-base">
              Based on your inputs, here&apos;s what may help improve your condition:
            </p>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
              {PROGRAM_TAGS.map((tag) => (
                <div
                  key={tag}
                  className="rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md bg-primary px-4 py-3 text-center text-xs font-semibold text-[#FEF9E0] shadow-sm md:text-sm"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" distance={20} duration={700} delay={120}>
          <div className="mt-8 flex justify-center md:mt-10">
            <PrimaryCTAButton
              href={onBookSessionClick ? "#" : "/book-a-session"}
              label="Book Your Session"
              size="md"
              arrowVariant="dark"
              className=""
              onClick={
                onBookSessionClick
                  ? (e) => {
                      e.preventDefault();
                      onBookSessionClick();
                    }
                  : undefined
              }
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
