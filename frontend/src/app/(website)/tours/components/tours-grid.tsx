"use client";

import { useMemo, useState } from "react";
import { Tour } from "../schema";
import { TourCard } from "@/components/common/tour-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIER_META, TIER_ORDER, tripDays, type TourTier } from "@/lib/pricing/tour-tier";

/** Recommended order uses the operator's own priority/featured flags. */
const SORTS = [
    { id: "recommended", label: "Recommended" },
    { id: "shortest", label: "Shortest first" },
    { id: "longest", label: "Longest first" },
    { id: "price-asc", label: "Price: low to high" },
    { id: "price-desc", label: "Price: high to low" },
    { id: "per-day-asc", label: "Cost per day: low to high" },
];

/** Per-day rate is what makes trips of different lengths comparable at all. */
function perDay(tour: Tour): number {
    return tour.pricing?.perDay ?? Number.POSITIVE_INFINITY;
}

/**
 * Below this many itineraries the filter apparatus costs more than it saves: a
 * dozen chips over seven cards is heavier than the inventory, and any
 * combination of them can empty a list the visitor could have read end to end.
 * Sort alone is the better tool at this size. The filters stay in the file and
 * come back on their own once the catalogue is big enough to need them.
 */
const FILTER_THRESHOLD = 12;

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
    const [tier, setTier] = useState<TourTier | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [sort, setSort] = useState<string>("recommended");

    const showFilters = tours.length >= FILTER_THRESHOLD;

    /**
     * The catalogue spans roughly $1,200 to $18,500, and the related-tours rail
     * can put those two next to each other. Without a stated range every price
     * is anchored only by whichever card was seen first, so a mid-priced trip
     * reads as either a bargain or a rip-off depending on arrival order.
     * Derived from the live inventory rather than written down, so it cannot
     * drift away from the cards underneath it.
     */
    const perDayRange = useMemo(() => {
        const rates = tours
            .map((tour) => tour.pricing?.perDay)
            .filter((rate): rate is number => typeof rate === "number" && Number.isFinite(rate));
        if (rates.length === 0) return null;
        const money = (value: number) =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            }).format(value);
        return { low: money(Math.min(...rates)), high: money(Math.max(...rates)) };
    }, [tours]);

    const categories = useMemo(
        () => Array.from(new Set(tours.map((tour) => tour.category).filter(Boolean) as string[])).sort(),
        [tours]
    );

    // Only offer tiers that something on the page actually sits in.
    const tiers = useMemo(
        () => TIER_ORDER.filter((t) => tours.some((tour) => tour.pricing?.tier === t)),
        [tours]
    );

    const visible = useMemo(() => {
        const filtered = tours.filter((tour) => {
            const activeBand = LENGTH_BANDS.find((b) => b.id === band);
            if (activeBand && !activeBand.test(tripDays(tour))) return false;
            if (tier && tour.pricing?.tier !== tier) return false;
            if (category && tour.category !== category) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            switch (sort) {
                case "shortest":
                    return tripDays(a) - tripDays(b);
                case "longest":
                    return tripDays(b) - tripDays(a);
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "per-day-asc":
                    return perDay(a) - perDay(b);
                default:
                    // Featured first, then the admin-set priority.
                    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
                    return (b.priority ?? 0) - (a.priority ?? 0);
            }
        });
    }, [tours, band, tier, category, sort]);

    const hasFilters = band !== null || tier !== null || category !== null;

    const clearFilters = () => {
        setBand(null);
        setTier(null);
        setCategory(null);
    };

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
            <div className="mb-10 flex flex-col gap-4 border-y border-black/5 py-6 md:flex-row md:items-center md:justify-between">
                {/* Each label + its chips is one flex-wrap unit. Flat wrapping put
                    a stray comfort chip at the head of the next line, directly
                    before the "Theme" label, where it read as a theme. */}
                <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", !showFilters && "hidden")}>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
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
                    </div>

                    {tiers.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                Comfort
                            </span>
                            {tiers.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    title={TIER_META[t].summary}
                                    aria-pressed={tier === t}
                                    onClick={() => setTier(tier === t ? null : t)}
                                    className={chip(tier === t)}
                                >
                                    {TIER_META[t].label}
                                </button>
                            ))}
                        </div>
                    )}

                    {categories.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                Theme
                            </span>
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
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 text-[13px] text-gray-500">
                    <label htmlFor="tours-sort" className="sr-only">
                        Sort itineraries
                    </label>
                    {/* appearance-none strips the OS widget so the control reads as
                        part of the same system as the filter chips; the chevron is
                        drawn back in and the select stays a real <select>, keeping
                        native keyboard and mobile behaviour. */}
                    <div className="relative">
                        <select
                            id="tours-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none border border-black/15 bg-white py-2 pl-4 pr-10 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-600 transition-colors hover:border-black hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                            {SORTS.map((option) => (
                                <option key={option.id} value={option.id} className="normal-case tracking-normal">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                    {/* "7 of 7" is noise when nothing can narrow the list. */}
                    <span aria-live="polite" className="whitespace-nowrap">
                        <strong className="font-semibold text-black">{visible.length}</strong>
                        {showFilters && ` of ${tours.length}`} itineraries
                    </span>
                    {showFilters && hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 hover:text-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="py-24 text-center text-gray-500">
                    No itineraries match those filters.{" "}
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-amber-600 underline underline-offset-4 hover:text-black"
                    >
                        Show all {tours.length}
                    </button>
                    .
                </p>
            ) : (
                <>
                    {perDayRange && (
                        <p className="mb-10 max-w-2xl text-sm font-light leading-relaxed text-gray-500">
                            These itineraries work out at{" "}
                            <strong className="font-medium text-black">
                                {perDayRange.low}&ndash;{perDayRange.high}
                            </strong>{" "}
                            per person per day, Sustainable Development Fee included. Shorter
                            trips cost more per day &mdash; the fixed costs of arriving are
                            spread over fewer of them.
                        </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                        <h2 className="sr-only">Itineraries</h2>
                        {visible.map((tour) => (
                            <TourCard key={tour.slug} tour={tour} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
