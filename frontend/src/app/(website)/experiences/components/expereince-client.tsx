"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Experience } from "@/app/admin/experiences/schema";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { ExperienceCard } from "@/components/common/experience-card";

interface ExperiencesClientProps {
    initialExperiences: Experience[];
}

export function ExperiencesClient({ initialExperiences }: ExperiencesClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const categoryParam = searchParams.get("category");

    const [activeCategory, setActiveCategory] = useState(categoryParam || "All");

    useEffect(() => {
        if (categoryParam) {
            setActiveCategory(categoryParam);
        } else {
            setActiveCategory("All");
        }
    }, [categoryParam]);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Get unique categories from experiences
    const categories = [
        "All",
        ...Array.from(new Set(initialExperiences.map((exp) => exp.category))),
    ];

    // Filter experiences by category
    const filteredExperiences =
        activeCategory === "All"
            ? initialExperiences
            : initialExperiences.filter((exp) => exp.category === activeCategory);

    return (
        <div className="bg-white min-h-screen pb-40">
            {/* Minimalist Filter Console */}
            <div className="border-t border-b border-black/5 sticky top-20 bg-white/95 backdrop-blur-xl z-30">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`
                                        px-6 py-2 text-[10px] font-mono uppercase tracking-[0.4em] transition-all relative group
                                        ${activeCategory === category
                                            ? "text-amber-600"
                                            : "text-gray-500 hover:text-black"
                                        }
                                    `}
                                >
                                    <span className="relative z-10">{category}</span>
                                    {activeCategory === category && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-black/5 border-l border-r border-amber-600/50"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-4 opacity-40">
                            <span className="font-mono text-[9px] text-black uppercase tracking-widest leading-none">
                                Browse <br /> Categories
                            </span>
                            <div className="h-8 w-px bg-black/10" />
                            <div className="font-mono text-[9px] text-black uppercase tracking-tighter">
                                BHUTAN
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experiences Grid */}
            <div className="container mx-auto px-6 pt-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 pl-12 border-l border-black/10">
                    <div className="max-w-xl">
                        <span className="font-mono text-amber-600/60 text-[10px] uppercase tracking-[0.3em] mb-4 block">
                        // viewing: {activeCategory.toLowerCase()}
                        </span>
                        <p className="text-gray-500 font-light italic leading-relaxed text-sm">
                            Explore our curated collection of {activeCategory === "All" ? "Bhutanese experiences" : activeCategory.toLowerCase() + " journeys"}.
                            Discover the soul of the Kingdom through every story.
                        </p>
                    </div>
                    <div className="font-mono text-[9px] text-gray-400 tracking-[0.4em] uppercase">
                        Total {activeCategory === "All" ? "Files" : "Results"}: {filteredExperiences.length.toString().padStart(2, '0')}
                    </div>
                </div>

                {filteredExperiences.length === 0 ? (
                    <div className="text-center py-32 bg-neutral-100/50 border border-black/5 rounded-sm">
                        <div className="w-12 h-12 border border-black/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <span className="font-mono text-[10px] text-amber-600">?</span>
                        </div>
                        <p className="font-mono text-xs uppercase tracking-[0.4em] text-gray-400">
                            No journeys found in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
                        {filteredExperiences.map((exp, index) => (
                            <ExperienceCard key={exp.slug} experience={exp} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
