"use client";

import { TourTimeline } from "./tour-timeline";
import { TourDay } from "../../schema";

interface TourItineraryProps {
    days: TourDay[];
    slug: string;
}

export function TourItinerary({ days, slug }: TourItineraryProps) {
    return (
        <div className="pt-40">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-24">
                    <div>
                        <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
              // expedition itinerary
                        </span>
                        <h2 className="text-4xl md:text-5xl font-light tracking-tighter uppercase text-black">
                            Day by <span className="italic font-serif normal-case text-amber-600">Day</span>
                        </h2>
                    </div>
                    <div className="hidden md:block font-mono text-[10px] text-gray-400 uppercase tracking-widest text-right font-bold">
                        Sequence Certified // Total Days: {days.length}
                    </div>
                </div>

                <TourTimeline days={days} slug={slug} />
            </div>
        </div>
    );
}
