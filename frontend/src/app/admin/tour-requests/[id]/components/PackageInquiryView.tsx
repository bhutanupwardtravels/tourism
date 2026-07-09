"use client";

import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Tour } from "@/app/(website)/tours/schema";
import { TourCard } from "@/components/common/tour-card";
import { TourOverview } from "@/app/(website)/tours/[slug]/components/tour-overview";
import { TourItinerary } from "@/app/(website)/tours/[slug]/components/tour-itenary";
import { Button } from "@/components/ui/button";

interface PackageInquiryViewProps {
    tour: Tour | null;
}

export function PackageInquiryView({ tour }: PackageInquiryViewProps) {
    const [showDetails, setShowDetails] = useState(false);

    if (!tour) {
        return (
            <div className="border border-gray-100 rounded-none p-32 text-center bg-gray-50/30">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-none flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <MapPin className="w-6 h-6 text-gray-200" />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Standard Inquiry</p>
                    <p className="text-gray-400 text-xs italic max-w-xs mx-auto">This traveler has requested information for a curated package or general inquiry.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-2xl font-semibold text-black tracking-tight">Requested Package</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-black rounded-none"
                >
                    {showDetails ? (
                        <>Hide Details <ChevronUp className="ml-2 w-3 h-3" /></>
                    ) : (
                        <>View Full Details <ChevronDown className="ml-2 w-3 h-3" /></>
                    )}
                </Button>
            </div>

            <div className="max-w-4xl">
                <TourCard tour={tour} index={0} onClick={() => setShowDetails(!showDetails)} />
            </div>

            {showDetails && (
                <div className="mt-12 space-y-12 border-t text-black border-gray-100 pt-12 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
                    <div className="admin-tour-preview">
                        <TourOverview tour={tour} />
                        <div className="-mt-32">
                            <TourItinerary days={tour.days} slug={tour.slug} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
