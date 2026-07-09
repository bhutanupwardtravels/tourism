import { createExperience } from "../actions";
import { ExperienceForm } from "../components/experience-form";

export default function CreateExperiencePage() {
  const createExperienceWithPrevState = createExperience.bind(null, null);

  return (
    <ExperienceForm
      title="Create New Experience"
      action={createExperienceWithPrevState}
    />
  );
}
