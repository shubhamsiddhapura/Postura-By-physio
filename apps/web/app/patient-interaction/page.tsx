import type { Metadata } from "next";
import { PatientInteractionExperience } from "./PatientInteractionExperience";

const SITE_URL = "https://www.posturabyphysio.com";

export const metadata: Metadata = {
  title: "Patient Interaction",
  description:
    "How we work with patients at Postura by Physio — care, communication, and your recovery journey.",
  alternates: { canonical: `${SITE_URL}/patient-interaction` },
};

export default function PatientInteractionPage() {
  return <PatientInteractionExperience />;
}
