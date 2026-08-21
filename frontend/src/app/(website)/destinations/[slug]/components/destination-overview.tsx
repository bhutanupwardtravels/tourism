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
        {/* A 12-track grid pays for 11 gaps, not the one you see between the
            two columns. At `lg` the container is 976px wide, so 11 x 96px of
            gap-24 alone overruns it and the sidebar hangs 80px past the edge;
            the gap has to stay under ~88px until `xl` widens the container. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-12 xl:gap-24 items-start">
          <Reveal y={0} x={-30} duration={1}
            className="lg:col-span-8">
            <span className="font-mono text-amber-500 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              {"// destination overview"}
            </span>
            {/* Same size as every other section heading on the site. Long names
                wrap on their own; what used to split this in two was a hard
                <br /> that fired regardless of the width available. */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
              The <span className="italic font-serif normal-case text-amber-600">Soul</span> of {name}
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
