"use client";

import { TourTimeline } from "./tour-timeline";
import { TourDay } from "../../schema";

interface TourItineraryProps {
    days: TourDay[];
    slug: string;
}

export function TourItinerary({ days, slug }: TourItineraryProps) {
    return (
        <div>
            <div>
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
              {"// expedition itinerary"}
                        </span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter uppercase text-black">
                            Day by <span className="italic font-serif normal-case text-amber-600">Day</span>
                        </h2>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-gray-400 uppercase tracking-widest text-right font-bold">
                        {days.length} days
                    </div>
                </div>

                <TourTimeline days={days} slug={slug} />
            </div>
        </div>
    );
}
