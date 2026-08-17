"use client";

import { useMemo, useState } from "react";
import { Tour } from "../schema";
import { TourCard } from "@/components/common/tour-card";
import { cn } from "@/lib/utils";

/** Duration is stored as free text ("12 Days / 11 Nights"); the leading number is the trip length. */
function tripDays(tour: Tour): number {
    const match = tour.duration?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

const LENGTH_BANDS = [
    { id: "short", label: "Up to 7 days", test: (d: number) => d > 0 && d <= 7 },
    { id: "mid", label: "8-12 days", test: (d: number) => d >= 8 && d <= 12 },
    { id: "long", label: "13+ days", test: (d: number) => d >= 13 },
];

interface ToursGridProps {
    tours: Tour[];
}

/**
 * Client-side filtering over the already-fetched list. With only a handful of
 * itineraries the point isn't paging — it's giving people a dimension to compare
 * on, so choosing doesn't mean reading every card end to end.
 */
export function ToursGrid({ tours }: ToursGridProps) {
    const [band, setBand] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);

    const categories = useMemo(
        () => Array.from(new Set(tours.map((tour) => tour.category).filter(Boolean) as string[])).sort(),
        [tours]
    );

    const visible = useMemo(
        () =>
            tours.filter((tour) => {
                const activeBand = LENGTH_BANDS.find((b) => b.id === band);
                if (activeBand && !activeBand.test(tripDays(tour))) return false;
                if (category && tour.category !== category) return false;
                return true;
            }),
        [tours, band, category]
    );

    const hasFilters = band !== null || category !== null;

    const chip = (active: boolean) =>
        cn(
            "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] border transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
            active
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-black/15 hover:border-black hover:text-black"
        );

    return (
        <>
            <div className="mb-16 flex flex-col gap-4 border-y border-black/5 py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Length
                    </span>
                    {LENGTH_BANDS.map((b) => (
                        <button
                            key={b.id}
                            type="button"
                            aria-pressed={band === b.id}
                            onClick={() => setBand(band === b.id ? null : b.id)}
                            className={chip(band === b.id)}
                        >
                            {b.label}
                        </button>
                    ))}

                    {categories.length > 1 && (
                        <>
                            <span className="mx-2 hidden h-5 w-px bg-black/10 md:block" />
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    aria-pressed={category === c}
                                    onClick={() => setCategory(category === c ? null : c)}
                                    className={chip(category === c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4 text-[13px] text-gray-500">
                    <span aria-live="polite">
                        {visible.length} of {tours.length} itineraries
                    </span>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setBand(null);
                                setCategory(null);
                            }}
                            className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 hover:text-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="py-24 text-center text-gray-500">
                    No itineraries match those filters.{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setBand(null);
                            setCategory(null);
                        }}
                        className="text-amber-600 underline underline-offset-4 hover:text-black"
                    >
                        Show all {tours.length}
                    </button>
                    .
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {visible.map((tour, index) => (
                        <TourCard key={tour.slug} tour={tour} index={index} />
                    ))}
                </div>
            )}
        </>
    );
}
