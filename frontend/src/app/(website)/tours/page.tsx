import { getAllTours } from "./actions";
import { ToursHeader } from "./components/tour-header";
import CallToAction from "@/components/common/call-to-action";
import { ToursGrid } from "./components/tours-grid";
import { Tour } from "./schema";
import { JsonLd } from "@/components/common/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Bhutan Tour Packages | Curated Expeditions",
    description:
        "Browse verified Bhutan tour packages from 5 to 15 days — Western Bhutan classics, spiritual heartland immersions, and off-the-beaten-path expeditions, each fully itinerarized.",
    path: "/tours",
});

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Bhutan Tour Packages",
          description: "Curated Bhutan tour packages from 5 to 15 days.",
          path: "/tours",
          items: tours.map((tour: Tour) => ({
            name: tour.title,
            path: `/tours/${tour.slug}`,
            image: tour.image,
          })),
        })}
      />
      <ToursHeader />

      <div className="container mx-auto px-6 pb-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 pb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter uppercase mb-2">
              The <span className="italic font-serif text-amber-600 normal-case">Selected</span> Journeys
            </h2>
            <p className="text-gray-500 font-light italic">
              "A collection of verified expeditions curated for deep discovery."
            </p>
          </div>
        </div>

        <ToursGrid tours={tours} />
      </div>

      <CallToAction />
    </div>
  );
}
