"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";
import { Experience } from "@/app/(website)/experiences/schema";
import { ExperienceCard } from "@/components/common/experience-card";
import { Button } from "@/components/ui/button";

interface ExperienceSelectorProps {
    experiences: Experience[];
    onSelect: (experience: Experience) => void;
    onClose: () => void;
}

export function ExperienceSelector({ experiences, onSelect, onClose }: ExperienceSelectorProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(experiences.map(e => e.category).filter(Boolean)));

    const filtered = experiences.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
            exp.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory ? exp.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-neutral-50 w-full max-w-7xl max-h-[90vh] rounded-xs overflow-hidden shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 block mb-2">
              // curated selection
                        </span>
                        <h2 className="text-black text-3xl font-light tracking-tight uppercase">Select Experience</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-white border-b border-gray-200 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-black bg-gray-50 border border-gray-200 rounded-xs pl-12 pr-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${!selectedCategory ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as string)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((exp, idx) => (
                            <div key={exp._id} className="relative group cursor-pointer" onClick={() => onSelect(exp)}>
                                <ExperienceCard experience={exp} index={idx + 1} disableLink={true} />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-40 pointer-events-none">
                                    <span className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Check className="w-4 h-4" /> add to itinerary
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-full py-24 text-center text-gray-400">
                                <p className="text-sm uppercase tracking-widest">No experiences found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
