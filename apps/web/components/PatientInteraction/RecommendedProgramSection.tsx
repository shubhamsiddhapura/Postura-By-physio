import { PrimaryCTAButton } from "../ui/PrimaryCTAButton";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";
import type { PatientInteractionAnswers } from "./PatientInteractionQuestionnaire";

/* ------------------------------------------------------------------ */
/* Programs + answer → score mapping                                  */
/* ------------------------------------------------------------------ */

const PROGRAM_IDS = [
  "postural",
  "ortho",
  "cardio",
  "womens",
  "geriatric",
  "neuro",
] as const;
type ProgramId = (typeof PROGRAM_IDS)[number];

const PROGRAM_LABELS: Record<ProgramId, string> = {
  postural: "Postural Correction Program",
  ortho: "Orthopedic Rehabilitation",
  cardio: "Cardio-Respiratory Rehabilitation",
  womens: "Women's Health Physiotherapy",
  geriatric: "Geriatric Rehabilitation",
  neuro: "Neurological rehabilitation",
};

/**
 * Stable fallback order used when no answers scored anything (e.g. the
 * user hasn't opened the questionnaire yet, or picked "Other"/"Unknown"
 * across the board). Matches the original static layout of this page.
 */
const DEFAULT_ORDER: ProgramId[] = [
  "postural",
  "ortho",
  "cardio",
  "womens",
  "geriatric",
  "neuro",
];

type Score = Partial<Record<ProgramId, number>>;

/**
 * Weighted mapping from a questionnaire answer string to program nudges.
 * Each answer can push more than one program. Weights are tuned so the
 * strongest signal (e.g. "Pregnancy / Post-delivery" → women's health)
 * dominates when combined with softer signals from other questions.
 */
function answerScore(answer: string): Score {
  switch (answer) {
    // --- about ---
    case "IT / Software Professional":
    case "Corporate / Desk Job":
    case "Student":
      return { postural: 3, ortho: 1 };
    case "Teacher / Standing Job":
      return { postural: 2, ortho: 2 };
    case "Healthcare Worker":
      return { ortho: 2, postural: 2 };
    case "Homemaker":
      return { ortho: 2, womens: 2, postural: 1 };
    case "Athlete / Sports Person":
      return { ortho: 3 };
    case "Senior Citizen":
      return { geriatric: 3, ortho: 1 };

    // --- activity ---
    case "4 - 6 hours sitting":
      return { postural: 1 };
    case "6 - 8 hours sitting":
      return { postural: 2, ortho: 1 };
    case "More than 8 hours sitting":
      return { postural: 3, ortho: 2 };
    case "Long standing hours":
      return { ortho: 2, postural: 1 };
    case "Physically demanding work":
      return { ortho: 3 };

    // --- discomfort ---
    case "Neck":
      return { postural: 3, ortho: 1 };
    case "Upper Back":
      return { postural: 3 };
    case "Lower Back":
      return { postural: 2, ortho: 2 };
    case "Shoulder":
    case "Ankle":
      return { ortho: 3 };
    case "Knee":
      return { ortho: 3, geriatric: 1 };
    case "Multiple Areas":
      return { ortho: 2, postural: 2 };
    case "Balance / Walking Difficulty":
      return { neuro: 3, geriatric: 2 };
    case "Breathing / Low Stamina":
      return { cardio: 4 };

    // --- cause ---
    case "Prolonged sitting / Poor posture":
      return { postural: 3 };
    case "Recent surgery":
    case "Sports injury":
      return { ortho: 3 };
    case "Slip / Fall":
      return { ortho: 3, geriatric: 1 };
    case "Pregnancy / Post-delivery":
      return { womens: 4 };
    case "Age-related weakness":
      return { geriatric: 4 };
    case "Neurological condition":
      return { neuro: 4 };
    case "Post-COVID weakness":
      return { cardio: 3 };

    // "Other" / "Unknown" / "Less than 4 hours sitting" — deliberately no signal
    default:
      return {};
  }
}

/** Returns `[label, ...]` in descending relevance for the given answers. */
function recommendedPrograms(
  answers: PatientInteractionAnswers | undefined
): string[] {
  if (!answers) return DEFAULT_ORDER.map((id) => PROGRAM_LABELS[id]);

  const totals: Record<ProgramId, number> = {
    postural: 0,
    ortho: 0,
    cardio: 0,
    womens: 0,
    geriatric: 0,
    neuro: 0,
  };
  for (const value of Object.values(answers)) {
    const add = answerScore(value);
    for (const id of PROGRAM_IDS) {
      totals[id] += add[id] ?? 0;
    }
  }

  const ranked = [...PROGRAM_IDS].sort((a, b) => {
    const diff = totals[b] - totals[a];
    return diff !== 0
      ? diff
      : DEFAULT_ORDER.indexOf(a) - DEFAULT_ORDER.indexOf(b);
  });

  const hits = ranked.filter((id) => totals[id] > 0);
  // No signal at all (shouldn't happen with the default-seeded answers,
  // but be safe) — fall back to the full static list.
  const picks = hits.length > 0 ? hits : DEFAULT_ORDER;

  return picks.map((id) => PROGRAM_LABELS[id]);
}

/** Grid column classes chosen to keep tiny lists centered & balanced. */
function gridColsFor(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

type RecommendedProgramSectionProps = {
  /** Patient-interaction page: open health summary modal instead of navigating. */
  onBookSessionClick?: () => void;
  /**
   * Live answers from the questionnaire above. When provided, the
   * program tags reorder / shrink to reflect the user's selections.
   * Absent → the original static six-program list is shown.
   */
  answers?: PatientInteractionAnswers;
};

export function RecommendedProgramSection({
  onBookSessionClick,
  answers,
}: RecommendedProgramSectionProps) {
  const programs = recommendedPrograms(answers);
  const personalized = Boolean(answers) && programs.length < DEFAULT_ORDER.length;

  return (
    <section className="bg-white pb-10 md:pb-20">
      <div className="mx-auto max-w-[90vw] md:px-4 border-t border-gray-200 py-10">
        <FadeIn direction="up" distance={28} duration={800} delay={0}>
          <div className="rounded-tl-[48px] rounded-br-[48px] rounded-bl-[18px] rounded-tr-[18px] border-2 border-primary bg-[#E5F7F6] px-6 py-10 text-center md:px-12 md:py-14">
            <h2 className="text-2xl font-bold text-primary md:text-4xl">
              Recommended Program for You
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-primary/70 md:text-base">
              {personalized
                ? "Based on what you shared above, these programs match your needs most directly:"
                : "Based on your inputs, here's what may help improve your condition:"}
            </p>

            <div
              className={cn(
                "mx-auto mt-8 grid max-w-4xl gap-3 md:gap-3",
                gridColsFor(programs.length)
              )}
            >
              {programs.map((tag, idx) => (
                <div
                  key={tag}
                  className={cn(
                    "rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md px-4 py-3 text-center text-xs font-semibold shadow-sm md:text-sm transition",
                    personalized && idx === 0
                      ? "bg-primary text-[#FEF9E0]"
                      : "bg-primary text-[#FEF9E0]"
                  )}
                >
                  {tag}
                </div>
              ))}
            </div>

            {personalized ? (
              <p className="mt-5 text-[11px] uppercase tracking-wider text-primary/60 md:text-xs">
                Primary focus highlighted · update the questions above to refine
              </p>
            ) : null}
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
