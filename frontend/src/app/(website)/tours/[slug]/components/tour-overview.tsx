"use client";

import { ShieldCheck } from "lucide-react";
import { Tour } from "../../schema";

interface TourOverviewProps {
    tour: Tour;
}

export function TourOverview({ tour }: TourOverviewProps) {
    return (
        <div className="lg:col-span-8">
            <div className="flex flex-col gap-12">
                <div className="max-w-3xl">
                    <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
            // expedition overview
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                        The <span className="italic font-serif normal-case text-amber-600">Narrative</span> <br />of {tour.title}
                    </h2>
                    <div className="relative pl-8 border-l border-black/10">
                        <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                            "{tour.description}"
                        </p>
                        <div className="mt-8 font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Verified Expedition Details // Kingdom of Bhutan
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
