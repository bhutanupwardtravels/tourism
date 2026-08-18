import { createExperience } from "../actions";
import { ExperienceForm } from "../components/experience-form";
import { initialActionState } from "@/lib/action-state";

export default function CreateExperiencePage() {
  const createExperienceWithPrevState = createExperience.bind(null, initialActionState);

  return (
    <ExperienceForm
      title="Create New Experience"
      action={createExperienceWithPrevState}
    />
  );
}
