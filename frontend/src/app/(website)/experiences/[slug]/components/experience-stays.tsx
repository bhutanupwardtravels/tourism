"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Hotel } from "@/app/admin/hotels/schema";
import { HotelCard } from "@/components/common/hotel-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface ExperienceStaysProps {
  hotels: Hotel[];
  experienceTitle: string;
}

const PAGE_SIZE = 6;
const ALL = "All";

export function ExperienceStays({ hotels, experienceTitle }: ExperienceStaysProps) {
  // Destinations the returned properties actually sit in — an experience that
  // spans Paro and Thimphu gets a filter, a single-valley one does not.
  const destinations = useMemo(() => {
    const names = new Set<string>();
    for (const hotel of hotels) {
      const name = hotel.resolvedDestinationName || hotel.destinationSlug;
      if (name) names.add(name);
    }
    return [...names].sort();
  }, [hotels]);

  const [activeDestination, setActiveDestination] = useState(ALL);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (activeDestination === ALL) return hotels;
    return hotels.filter(
      (hotel) => (hotel.resolvedDestinationName || hotel.destinationSlug) === activeDestination
    );
  }, [hotels, activeDestination]);

  if (hotels.length === 0) return null;

  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const blurb =
    destinations.length === 0
      ? `Properties near where ${experienceTitle} takes place.`
      : destinations.length === 1
        ? `Properties in ${destinations[0]}, the valley ${experienceTitle} unfolds in.`
        : `Properties across ${destinations.slice(0, -1).join(", ")} and ${
            destinations[destinations.length - 1]
          } — the valleys ${experienceTitle} unfolds in.`;

  return (
    <section className="py-40 bg-[#faf9f6] text-black relative border-t border-black/5 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <Reveal
              as="span"
              y={0}
              className="block font-mono text-amber-600 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4"
            >
              {"// after the day ends"}
            </Reveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter uppercase text-black leading-tight mb-8">
              Where to <span className="italic font-serif normal-case text-amber-600">Rest</span>
            </h2>
            <p className="text-lg text-black/60 font-light leading-relaxed">
              {blurb} Choose the one you would rather return to at nightfall.
            </p>
          </div>
          <Link
            href="/hotels"
            className="font-mono text-xs tracking-[0.4em] uppercase text-black hover:text-amber-600 transition-colors border-b border-black pb-1 shrink-0 font-bold"
          >
            See all hotels
          </Link>
        </div>

        {destinations.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-16">
            {[ALL, ...destinations].map((name) => (
              <button
                key={name}
                onClick={() => {
                  setActiveDestination(name);
                  setDisplayCount(PAGE_SIZE);
                }}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.25em] px-6 py-3 border transition-all duration-500",
                  activeDestination === name
                    ? "bg-black text-white border-black"
                    : "border-black/10 text-black/60 hover:border-black/40 hover:text-black"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayed.map((hotel) => (
            <HotelCard key={hotel.id || hotel.slug} hotel={hotel} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-24">
            <button
              onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
              className="backdrop-blur-md border border-black/10 text-black px-12 py-5 font-mono text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Load More Stays
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
