"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { PackageSelection } from "./package-selection";
import { CustomItineraryBuilder } from "./custom-itinerary-builder";
import { TourRequestForm } from "./tour-request-form";
import { PlanMyTripHero } from "./plan-my-trip-hero";
import { Tour } from "../../tours/schema";
import { Destination } from "../../destinations/schema";
import { Experience } from "../../experiences/schema";
import { Hotel } from "../../../admin/hotels/schema";
import { Cost } from "../../../admin/settings/schema";

type PlanningStep = "mode_selection" | "package_list" | "custom_builder" | "inquiry_form";

interface PlanMyTripPageProps {
    packages: Tour[];
    destinations: Destination[];
    allDestinations: Destination[];
    experiences: Experience[];
    hotels: Hotel[];
    costs: Cost[];
}

export default function PlanMyTripClient({
    packages = [],
    destinations = [],
    allDestinations = [],
    experiences = [],
    hotels = [],
    costs = []
}: PlanMyTripPageProps) {
    const searchParams = useSearchParams();
    const [step, setStep] = useState<PlanningStep>("mode_selection");
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

    useEffect(() => {
        const packageSlug = searchParams.get("package");
        if (packageSlug && packages.length > 0) {
            const foundTour = packages.find(p => p.slug === packageSlug);
            if (foundTour) {
                setStep("package_list");
                setSelectedTour(foundTour);
            }
        }
    }, [searchParams, packages]);

    const handleTourSelect = (tour: Tour) => {
        setSelectedTour(tour);
        setStep("inquiry_form");
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            <PlanMyTripHero />

            {/* Mode Selection / Interface Area */}
            <section className="relative -mt-12 px-6">
                <div className="container mx-auto">
                    <AnimatePresence mode="wait">
                        {step === "mode_selection" ? (
                            <motion.div
                                key="mode-selection"
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="grid md:grid-cols-2 gap-px bg-black/5 p-px shadow-2xl"
                            >
                                {/* Curated Package Card */}
                                <motion.button
                                    onClick={() => setStep("package_list")}
                                    className="group relative overflow-hidden bg-white hover:bg-neutral-50 transition-all duration-700 p-16 md:p-24 text-left flex flex-col justify-between aspect-4/5 md:aspect-auto"
                                >
                                    <div className="space-y-8 relative z-10">
                                        <div className="w-12 h-12 border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <Sparkles className="w-5 h-5 text-black group-hover:text-white transition-all duration-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-6 leading-none text-black">
                                                Curated <br />
                                                <span className="italic font-serif normal-case text-amber-600">Collections</span>
                                            </h2>
                                            <p className="text-gray-500 text-lg leading-relaxed font-light italic max-w-sm">
                                                Select from our masterfully designed archetypes for a seamless immersion into Bhutan's soul.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-hover:text-black transition-all">
                                        Explore Archetypes <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-500" />
                                    </div>

                                    {/* Abstract Overlay */}
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Sparkles className="w-64 h-64 rotate-12 text-black group-hover:text-amber-600 transition-all" />
                                    </div>
                                </motion.button>

                                {/* Custom Bespoke Card */}
                                <motion.button
                                    onClick={() => setStep("custom_builder")}
                                    className="group relative overflow-hidden bg-white hover:bg-neutral-50 transition-all duration-700 p-16 md:p-24 text-left flex flex-col justify-between aspect-4/5 md:aspect-auto"
                                >
                                    <div className="space-y-8 relative z-10">
                                        <div className="w-12 h-12 border border-black/10 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                                            <Heart className="w-5 h-5 text-black group-hover:text-white transition-all duration-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-6 leading-none text-black">
                                                Bespoke <br />
                                                <span className="italic font-serif normal-case text-amber-600">Architecture</span>
                                            </h2>
                                            <p className="text-gray-500 text-lg leading-relaxed font-light italic max-w-sm">
                                                Engage our interactive workshop to architect a unique journey that resonates with your specific narrative.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-hover:text-amber-600 transition-all">
                                        Commence Workshop <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-500" />
                                    </div>

                                    {/* Abstract Overlay */}
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Heart className="w-64 h-64 -rotate-12 text-black group-hover:text-amber-600 transition-all" />
                                    </div>
                                </motion.button>
                            </motion.div>
                        ) : step === "package_list" ? (
                            <div className="py-24">
                                <PackageSelection
                                    packages={packages}
                                    selectedPackage={selectedTour}
                                    onBack={() => setStep("mode_selection")}
                                    onSelect={handleTourSelect}
                                />
                            </div>
                        ) : step === "custom_builder" ? (
                            <div className="py-24">
                                <CustomItineraryBuilder
                                    experiences={experiences}
                                    destinations={destinations}
                                    allDestinations={allDestinations}
                                    hotels={hotels}
                                    costs={costs}
                                    onBack={() => setStep("mode_selection")}
                                />
                            </div>
                        ) : step === "inquiry_form" ? (
                            <div className="py-24">
                                <TourRequestForm
                                    selectedTour={selectedTour}
                                    onBack={() => setStep("package_list")}
                                />
                            </div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
