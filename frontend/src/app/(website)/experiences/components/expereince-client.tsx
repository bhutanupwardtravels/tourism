"use client";

import { Experience } from "@/app/admin/experiences/schema";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { ExperienceCard } from "@/components/common/experience-card";
import { filterChip } from "@/components/common/filter-chip";

interface ExperiencesClientProps {
    initialExperiences: Experience[];
}

export function ExperiencesClient({ initialExperiences }: ExperiencesClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const categoryParam = searchParams.get("category");

    // The URL is the single source of truth for the filter, so deriving it here
    // keeps the two from drifting apart on back/forward navigation.
    const activeCategory = categoryParam || "All";

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Counts travel with the label: "Cultural Immersion" is 35 of 91 and the
    // smaller categories are a handful, which is worth knowing before a click
    // rather than after one.
    const countByCategory = initialExperiences.reduce<Record<string, number>>((acc, exp) => {
        acc[exp.category] = (acc[exp.category] ?? 0) + 1;
        return acc;
    }, {});

    const categories = [
        "All",
        ...Array.from(new Set(initialExperiences.map((exp) => exp.category))),
    ];

    const countFor = (category: string) =>
        category === "All" ? initialExperiences.length : countByCategory[category] ?? 0;

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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={activeCategory === category}
                                onClick={() => handleCategoryChange(category)}
                                className={filterChip(activeCategory === category)}
                            >
                                {category}
                                <span
                                    className={
                                        activeCategory === category
                                            ? "ml-2 text-white/60"
                                            : "ml-2 text-gray-400"
                                    }
                                >
                                    {countFor(category)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Experiences Grid */}
            <div className="container mx-auto px-6 pt-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-12 pl-12 border-l border-black/10">
                    <div className="max-w-xl">
                        <span className="font-mono text-amber-600/60 text-xs uppercase tracking-[0.3em] mb-4 block">
                        {`// viewing: ${activeCategory.toLowerCase()}`}
                        </span>
                        <p className="text-gray-500 font-light italic leading-relaxed text-sm">
                            Explore our curated collection of {activeCategory === "All" ? "Bhutanese experiences" : activeCategory.toLowerCase() + " journeys"}.
                            Discover the soul of the Kingdom through every story.
                        </p>
                    </div>
                    <div className="whitespace-nowrap text-[13px] text-gray-500">
                        <strong className="font-semibold text-black">{filteredExperiences.length}</strong>
                        {filteredExperiences.length === 1 ? " experience" : " experiences"}
                    </div>
                </div>

                {filteredExperiences.length === 0 ? (
                    <div className="text-center py-32 bg-neutral-100/50 border border-black/5 rounded-sm">
                        <div className="w-12 h-12 border border-black/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <span className="font-mono text-xs text-amber-600">?</span>
                        </div>
                        <p className="font-mono text-xs uppercase tracking-[0.4em] text-gray-400">
                            No journeys found in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
                        <h2 className="sr-only">Experiences</h2>
                        {filteredExperiences.map((exp, index) => (
                            <ExperienceCard key={exp.slug} experience={exp} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
