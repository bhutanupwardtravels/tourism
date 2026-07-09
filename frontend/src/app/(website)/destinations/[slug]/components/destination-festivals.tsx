"use client";

import { Experience } from "../../schema";
import { FestivalCard } from "@/components/common/festival-card";
import { useState } from "react";

interface DestinationFestivalsProps {
  festivals: Experience[];
}

export function DestinationFestivals({ festivals }: DestinationFestivalsProps) {
  const [displayCount, setDisplayCount] = useState(4);

  if (festivals.length === 0) return null;

  const sortedFestivals = [...festivals].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const displayedFestivals = sortedFestivals.slice(0, displayCount);
  const hasMore = displayCount < sortedFestivals.length;

  return (
    <section className="py-40 bg-white text-black relative border-t border-black/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              // cultural festivals
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter uppercase leading-tight">
              Cultural <span className="italic font-serif normal-case text-amber-600">Festivals</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {displayedFestivals.map((festival, index) => (
            <FestivalCard key={festival.slug} festival={festival} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-24">
            <button
              onClick={() => setDisplayCount((prev) => prev + 4)}
              className="backdrop-blur-md border border-black/10 text-black px-12 py-5 font-mono text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Load More Festivals
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
