"use client";

import { motion } from "framer-motion";
import { Tour } from "../../tours/schema";
import { TourCard } from "@/components/common/tour-card";

interface PackageSelectionProps {
    packages: Tour[];
    selectedPackage?: Tour | null;
    onBack: () => void;
    onSelect: (tour: Tour) => void;
}

export function PackageSelection({ packages, selectedPackage, onBack, onSelect }: PackageSelectionProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
        >
            <div className="flex justify-between items-end mb-24 pb-12">
                <div className="space-y-4">
                    <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold block">
                        // selection mode
                    </span>
                    <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase leading-none text-black">
                        Curated <span className="italic font-serif normal-case text-amber-600">Journeys</span>
                    </h2>
                </div>
                <button
                    onClick={onBack}
                    className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-amber-500 transition-colors"
                >
                    <span className="w-8 h-px bg-gray-200 group-hover:w-12 group-hover:bg-amber-500 transition-all" />
                    Change Mode
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {selectedPackage && (
                    <div className="md:col-span-2 mb-12">
                        <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold block mb-8">
                            // current selection
                        </span>
                        <TourCard
                            tour={selectedPackage}
                            index={0}
                            onClick={() => onSelect(selectedPackage)}
                        />
                        <div className="mt-16 pt-16 border-t border-black/5">
                            <span className="font-mono text-gray-400 text-[10px] uppercase tracking-[0.5em] font-bold block">
                                // other archetypes
                            </span>
                        </div>
                    </div>
                )}
                {packages
                    .filter(pkg => pkg.slug !== selectedPackage?.slug)
                    .map((pkg, index) => (
                        <TourCard
                            key={pkg.slug || index}
                            tour={pkg}
                            index={index + (selectedPackage ? 1 : 0)}
                            onClick={() => onSelect(pkg)}
                        />
                    ))}
            </div>

            <div className="mt-32 text-center pt-24 border-t border-black/5">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.5em] max-w-lg mx-auto leading-loose">
                    All packages include premium logistics, visa management, and private guides certified by the Kingdom of Bhutan.
                </p>
            </div>
        </motion.div>
    );
}
