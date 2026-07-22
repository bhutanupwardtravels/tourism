import { getExperiences } from "./actions";
import { ExperiencesClient } from "./components/expereince-client";
import { ExperiencesHeader } from "./components/experience-header";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Bhutan Experiences & Activities",
    description:
        "Curated Bhutanese experiences — temple visits, high-altitude treks, living festivals, and cultural workshops — organized by destination and interest.",
    path: "/experiences",
});

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Cinematic Header Section */}
      <ExperiencesHeader />

      <ExperiencesClient initialExperiences={experiences} />
    </div>
  );
}
