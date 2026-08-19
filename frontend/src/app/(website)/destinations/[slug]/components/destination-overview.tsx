"use client";

import { ReservationCard } from "@/components/common/reservation-card";
import { Reveal } from "@/components/ui/reveal";

interface DestinationOverviewProps {
  name: string;
  description: string;
  slug: string;
}

export function DestinationOverview({
  name,
  description,
  slug,
}: DestinationOverviewProps) {
  return (
    <section className="pt-40 bg-white text-black relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <Reveal y={0} x={-30} duration={1}
            className="lg:col-span-8">
            <span className="font-mono text-amber-500 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              {"// destination overview"}
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
              The <span className="italic font-serif normal-case text-amber-600">Soul</span> <br />of {name}
            </h2>
            <div className="relative pl-8 border-l border-black/10">
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                &quot;{description}&quot;
              </p>
              <div className="mt-8 font-mono text-xs text-gray-400 uppercase tracking-widest">
                verified information // Bhutan
              </div>
            </div>
          </Reveal>

          {/* Sidebar / Booking Card */}
          <ReservationCard slug={slug} className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}
