import type { PatientInteractionAnswers } from "../../components/PatientInteraction/PatientInteractionQuestionnaire";

/**
 * Bridge between `/patient-interaction` and `/book-a-session`.
 *
 * The questionnaire lives on one page; the booking form on another. Rather
 * than pushing every answer through the URL (noisy) or a global store
 * (overkill), we cache the last confirmed answers in sessionStorage so the
 * booking form can tack them onto the POST payload if the user arrived from
 * that flow.
 *
 * Keys are namespaced under `postura:` to avoid collisions and the store
 * is cleared once consumed so a refresh or a direct visit doesn't carry
 * stale context.
 */

const STORAGE_KEY = "postura:patient-interaction-answers";

export function saveInteractionAnswers(
  answers: PatientInteractionAnswers
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // SessionStorage can be blocked (private mode, quota). Non-fatal — the
    // booking still works without the questionnaire context.
  }
}

export function readInteractionAnswers(): PatientInteractionAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PatientInteractionAnswers>;
    // Only accept objects with all four string fields set.
    if (
      !parsed ||
      typeof parsed.about !== "string" ||
      typeof parsed.activity !== "string" ||
      typeof parsed.discomfort !== "string" ||
      typeof parsed.cause !== "string"
    ) {
      return null;
    }
    return {
      about: parsed.about,
      activity: parsed.activity,
      discomfort: parsed.discomfort,
      cause: parsed.cause,
    };
  } catch {
    return null;
  }
}

export function clearInteractionAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
