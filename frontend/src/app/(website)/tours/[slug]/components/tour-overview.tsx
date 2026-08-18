"use client";

import { Check, ShieldCheck } from "lucide-react";
import { Tour } from "../../schema";

interface TourOverviewProps {
    tour: Tour;
}

export function TourOverview({ tour }: TourOverviewProps) {
    return (
        <div>
            <div className="flex flex-col gap-12">
                <div className="max-w-3xl">
                    <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
            {"// overview"}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                        About this <span className="italic font-serif normal-case text-amber-600">trip</span>
                    </h2>
                    <div className="relative pl-8 border-l border-black/10">
                        <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                            &quot;{tour.description}&quot;
                        </p>
                        <div className="mt-8 font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Licensed tour operator, Kingdom of Bhutan
                        </div>
                    </div>

                    {tour.highlights && tour.highlights.length > 0 && (
                        <div className="mt-12 border border-black/10 p-8">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black mb-6">
                                At a glance
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {tour.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
                                        <Check className="w-4 h-4 mt-1 shrink-0 text-amber-600" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 pt-6 border-t border-black/5 text-[13px] text-gray-500 leading-relaxed">
                                {tour.days.length} days planned day by day. Includes a licensed private guide,
                                private transport, entry and monument fees, and the Sustainable Development Fee.
                                International flights are not included.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
