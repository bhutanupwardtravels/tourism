import { notFound } from "next/navigation";
import { getExperienceTypeById } from "../actions";
import { ExperienceTypeForm } from "../components/experience-type-form";

interface ExperienceTypeViewPageProps {
    params: Promise<{ id: string }>;
}

export default async function ExperienceTypeViewPage({
    params,
}: ExperienceTypeViewPageProps) {
    const { id } = await params;
    const experienceType = await getExperienceTypeById(id);

    if (!experienceType) {
        notFound();
    }

    return (
        <ExperienceTypeForm
            title={`${experienceType.title}`}
            initialData={experienceType}
            isReadOnly={true}
        />
    );
}
