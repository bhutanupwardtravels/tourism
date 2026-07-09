import { getAllTours } from "./actions";
import { ToursHeader } from "./components/tour-header";
import CallToAction from "@/components/common/call-to-action";
import { TourCard } from "@/components/common/tour-card";
import { Tour } from "./schema";

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
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
          <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest text-right">
            Total Results: {tours.length} // BHU-EXP-2025
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
          {tours.map((tour: Tour, index: number) => (
            <TourCard key={tour.id} tour={tour} index={index} />
          ))}
        </div>
      </div>

      <CallToAction />
    </div>
  );
}
