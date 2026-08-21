"use client";

import { Coffee, Wifi, Car, Tv, Wind, ShieldCheck, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ReservationCard } from "@/components/common/reservation-card";

interface HotelOverviewProps {
    slug: string;
    description: string;
    amenities?: string[];
    rooms?: number;
}

const amenityIcons: Record<string, LucideIcon> = {
    wifi: Wifi,
    "free wifi": Wifi,
    coffee: Coffee,
    "tea/coffee": Coffee,
    parking: Car,
    "free parking": Car,
    tv: Tv,
    "satellite tv": Tv,
    ac: Wind,
    "air conditioning": Wind,
};

export function HotelOverview({ slug, description, amenities, rooms }: HotelOverviewProps) {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-12">
                    {/* Same shape as the tour overview: only the prose is paired
                        with the planner card, and the fact panel runs full width
                        below. As a sidebar the amenity list grew a column deep
                        enough to dwarf the description it sat beside. */}
                    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-24">
                        <div className="max-w-3xl lg:col-span-8">
                            <Reveal y={30} duration={0.8}>
                                <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-4 block font-bold">
                                    {"// sanctuary profile"}
                                </span>
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                                    The <span className="italic font-serif normal-case text-amber-600">Spirit</span> of Your Stay
                                </h2>
                                <div className="relative pl-8 border-l border-black/10">
                                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                                        &quot;{description}&quot;
                                    </p>
                                    <div className="mt-8 font-mono text-xs text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                                        Hospitality Standards Certified // Kingdom of Bhutan
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <ReservationCard
                            slug={slug}
                            description="Tell us your dates and group size and a specialist will build an itinerary around this stay. You'll get a detailed quote within 24 hours."
                            className="lg:col-span-4"
                        />
                    </div>

                    {amenities && amenities.length > 0 && (
                        <div className="mt-12 border border-black/10 p-8">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black mb-6">
                                Available amenities
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                {amenities.map((amenity) => {
                                    const Icon = amenityIcons[amenity.toLowerCase()] || ShieldCheck;
                                    return (
                                        <li
                                            key={amenity}
                                            className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed"
                                        >
                                            <Icon className="w-4 h-4 mt-1 shrink-0 text-amber-600" />
                                            <span className="first-letter:uppercase">{amenity}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            {rooms && (
                                <p className="mt-8 pt-6 border-t border-black/5 text-sm text-gray-500 leading-relaxed">
                                    {rooms} suites available.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
