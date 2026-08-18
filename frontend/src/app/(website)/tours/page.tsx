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

      {/* No second heading here. "Our Expeditions" above already orients the
          reader; "The Selected Journeys" repeated the same idea and pushed the
          first card off screen for no added information. */}
      <div className="container mx-auto px-6 pb-40">
        <ToursGrid tours={tours} />
      </div>

      <CallToAction />
    </div>
  );
}
