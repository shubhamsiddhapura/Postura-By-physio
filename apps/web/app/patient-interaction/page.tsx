import type { Metadata } from "next";
import { PatientInteractionExperience } from "./PatientInteractionExperience";

export const metadata: Metadata = {
  title: "Patient Interaction | Postura by Physio",
  description:
    "How we work with patients at Postura by Physio — care, communication, and your recovery journey.",
};

export default function PatientInteractionPage() {
  return <PatientInteractionExperience />;
}
