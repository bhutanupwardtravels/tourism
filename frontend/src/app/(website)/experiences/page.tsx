import { Suspense } from "react";
import { getExperiences } from "./actions";
import { ExperiencesClient } from "./components/expereince-client";
import { ExperiencesHeader } from "./components/experience-header";
import { ExperienceCard } from "@/components/common/experience-card";
import { JsonLd } from "@/components/common/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

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
      <JsonLd
        data={collectionPageJsonLd({
          name: "Bhutan Experiences & Activities",
          description: "Curated Bhutanese experiences organized by destination and interest.",
          path: "/experiences",
          items: experiences.map((experience) => ({
            name: experience.title,
            path: `/experiences/${experience.slug}`,
            image: experience.image,
          })),
        })}
      />
      {/* Cinematic Header Section */}
      <ExperiencesHeader />

      {/*
        ExperiencesClient reads useSearchParams (category filter), which requires
        a Suspense boundary. The fallback renders the full, unfiltered grid so the
        page still ships real, crawlable content before client JS hydrates.
      */}
      <Suspense
        fallback={
          <div className="bg-white min-h-screen pb-40">
            <div className="container mx-auto px-6 pt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
                {experiences.map((experience, index) => (
                  <ExperienceCard key={experience.slug} experience={experience} index={index} />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <ExperiencesClient initialExperiences={experiences} />
      </Suspense>
    </div>
  );
}
