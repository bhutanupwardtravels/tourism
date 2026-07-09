import { getExperienceById, updateExperience } from "../../actions";
import { ExperienceForm } from "../../components/experience-form";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  const updateExperienceWithId = updateExperience.bind(null, id, null);

  return (
    <ExperienceForm
      title="Edit Experience"
      initialData={experience}
      action={updateExperienceWithId}
    />
  );
}
