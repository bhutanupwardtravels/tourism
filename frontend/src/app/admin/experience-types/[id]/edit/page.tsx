import { notFound } from "next/navigation";
import { getExperienceTypeById, updateExperienceType } from "../../actions";
import { ExperienceTypeForm } from "../../components/experience-type-form";

interface EditExperienceTypePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExperienceTypePage({
    params,
}: EditExperienceTypePageProps) {
    const { id } = await params;
    const experienceType = await getExperienceTypeById(id);

    if (!experienceType) {
        notFound();
    }

    // Bind the id to the update action
    const updateActionWithId = updateExperienceType.bind(null, id);

    return (
        <ExperienceTypeForm
            title={`Edit ${experienceType.title}`}
            initialData={experienceType}
            action={updateActionWithId}
        />
    );
}
