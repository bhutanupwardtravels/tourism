"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { Tour } from "../../schema";
import { ReservationCard } from "@/components/common/reservation-card";

/**
 * What the price covers, as a list rather than a sentence.
 *
 * These were previously one run-on paragraph with the single exclusion —
 * international flights — as a trailing clause. At this price the exclusions
 * are the part people actually search the page for, and a clause inside a
 * paragraph is the one place they will not look. Same facts, made scannable.
 *
 * Constants rather than schema fields because they hold for every itinerary. If
 * they ever stop being uniform they belong on the tour record instead.
 */
const INCLUDED = [
    "Licensed private guide",
    "Private transport throughout",
    "Entry and monument fees",
    "Sustainable Development Fee",
];

const NOT_INCLUDED = ["International flights"];

interface TourOverviewProps {
    tour: Tour;
}

export function TourOverview({ tour }: TourOverviewProps) {
    return (
        <div className="flex flex-col gap-12">
            {/* Only the prose is paired with the planner card. The fact panels
                below run the full width, so the card sits beside the intro
                rather than trailing down the page next to them. */}
            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-24">
                <div className="max-w-3xl lg:col-span-8">
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
                        <div className="mt-8 font-mono text-xs text-gray-500 uppercase tracking-widest flex items-center gap-3 font-bold">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Licensed tour operator, Kingdom of Bhutan
                        </div>
                    </div>
                </div>

                <ReservationCard
                    slug={tour.slug}
                    href={`/plan-my-trip?package=${tour.slug}`}
                    description="Tell us your dates and group size and a specialist will tailor this itinerary to you. You'll get a detailed quote within 24 hours."
                    className="lg:col-span-4"
                />
            </div>
            <div>
                {tour.highlights && tour.highlights.length > 0 && (
                    <div className="mt-12 border border-black/10 p-8">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black mb-6">
                            At a glance
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                            {tour.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
                                    <Check className="w-4 h-4 mt-1 shrink-0 text-amber-600" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 pt-6 border-t border-black/5 text-sm text-gray-500 leading-relaxed">
                            {tour.days.length} days, planned day by day.
                        </p>
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
                    <div className="bg-white p-8">
                        <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-black">
                            Included in the price
                        </h3>
                        <ul className="space-y-4">
                            {INCLUDED.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-700">
                                    <Check className="mt-1 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-8">
                        <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-black">
                            Not included
                        </h3>
                        <ul className="space-y-4">
                            {NOT_INCLUDED.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-700">
                                    <X className="mt-1 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        {/* Better to name the gap than to let someone assume either way. */}
                        <p className="mt-6 border-t border-black/5 pt-5 text-[13px] leading-relaxed text-gray-500">
                            Anything else you are unsure about,{" "}
                            <Link href="/enquire" className="text-amber-600 underline underline-offset-4 hover:text-black">
                                ask before you book
                            </Link>{" "}
                            and we will confirm it in writing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
