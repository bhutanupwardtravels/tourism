import { createExperienceType } from "../actions";
import { ExperienceTypeForm } from "../components/experience-type-form";

export default function NewExperienceTypePage() {
    return (
        <ExperienceTypeForm
            title="Add New Experience Type"
            action={createExperienceType}
        />
    );
}
