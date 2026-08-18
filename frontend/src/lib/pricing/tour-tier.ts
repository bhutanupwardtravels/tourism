/**
 * Comfort tier and per-day price for a published itinerary.
 *
 * A tour's headline price is the sum of its fees, its experiences and —
 * overwhelmingly — its hotel nights. Hotel standard is therefore the single
 * biggest driver of the spread between itineraries, and while it stays hidden
 * the prices read as arbitrary: a 15-day COMO trip lands well below a 12-day
 * Amankora one, and nothing on the page says why.
 *
 * Tier is derived here rather than stored on the row so it can never contradict
 * the itinerary it describes — it is read back from the same hotel rates that
 * produced the price in the first place.
 */

export type TourTier = "comfort" | "premium" | "luxury";

/** Just the hotel fields the maths needs, keyed by hotel id. */
export interface HotelRate {
    name: string;
    price: number;
}
export type HotelRateIndex = Map<string, HotelRate>;

export interface TourPricing {
    /** Trip length in days, from `duration` and falling back to the itinerary. */
    days: number;
    /** Trip length in nights — what the SDF and hotels are actually charged on. */
    nights: number;
    /** Hotel placements found on the itinerary. Should equal `nights`. */
    hotelNights: number;
    /** Average nightly hotel spend, or null when no priced hotel is placed. */
    nightlyRate: number | null;
    /** Headline price divided by trip length, so the ladder is comparable. */
    perDay: number | null;
    tier: TourTier | null;
    /** Hotel brand the itinerary spends the most nights' budget with. */
    signatureStay: string | null;
}

export const TIER_META: Record<TourTier, { label: string; summary: string; rank: number }> = {
    comfort: {
        label: "Comfort",
        summary: "Three-star town hotels and family-run lodges",
        rank: 1,
    },
    premium: {
        label: "Premium",
        summary: "Boutique resorts and international four-star",
        rank: 2,
    },
    luxury: {
        label: "Luxury",
        summary: "Amankora, COMO, Six Senses and their peers",
        rank: 3,
    },
};

export const TIER_ORDER: TourTier[] = ["comfort", "premium", "luxury"];

/** Average nightly hotel spend (USD) at which an itinerary enters each tier. */
const TIER_FLOORS: { tier: TourTier; from: number }[] = [
    { tier: "luxury", from: 700 },
    { tier: "premium", from: 250 },
    { tier: "comfort", from: 0 },
];

export function tierForNightlyRate(rate: number | null | undefined): TourTier | null {
    if (rate == null || !Number.isFinite(rate) || rate <= 0) return null;
    return (TIER_FLOORS.find((floor) => rate >= floor.from) ?? TIER_FLOORS[TIER_FLOORS.length - 1]).tier;
}

// Only the shape the maths reads. The published Tour type describes days more
// loosely than the builder writes them (the `items` array is jsonb), so the day
// shape stays open rather than forcing a cast at every call site.
interface ItineraryDayLike {
    items?: { hotelId?: string }[];
    [key: string]: unknown;
}

interface PricedTourLike {
    duration?: string;
    price?: number | string;
    days?: readonly ItineraryDayLike[];
}

/** Duration is free text ("12 Days / 11 Nights"); fall back to the itinerary length. */
export function tripDays(tour: PricedTourLike | null | undefined): number {
    const explicit = /(\d+)\s*days?/i.exec(tour?.duration ?? "");
    if (explicit) return parseInt(explicit[1], 10);
    const leading = /\d+/.exec(tour?.duration ?? "");
    if (leading) return parseInt(leading[0], 10);
    return tour?.days?.length ?? 0;
}

/** Nights are what hotels and the SDF are billed on — always one less than days. */
export function tripNights(tour: PricedTourLike | null | undefined): number {
    const explicit = /(\d+)\s*nights?/i.exec(tour?.duration ?? "");
    if (explicit) return parseInt(explicit[1], 10);
    const days = tripDays(tour);
    return days > 0 ? days - 1 : 0;
}

/** "Amankora (Paro)" and "Amankora (Punakha)" are one brand for comparison purposes. */
function hotelBrand(name: string): string {
    return name.replace(/\s*\([^)]*\)\s*$/, "").trim() || name;
}

export function summarizeTourPricing(
    tour: PricedTourLike | null | undefined,
    hotels: HotelRateIndex
): TourPricing {
    const days = tripDays(tour);
    const nights = tripNights(tour);

    let hotelNights = 0;
    let hotelSpend = 0;
    const spendByBrand = new Map<string, number>();

    for (const day of tour?.days ?? []) {
        for (const item of day?.items ?? []) {
            if (!item?.hotelId) continue;
            hotelNights += 1;

            const rate = hotels.get(item.hotelId);
            if (!rate?.price) continue;

            hotelSpend += rate.price;
            const brand = hotelBrand(rate.name);
            spendByBrand.set(brand, (spendByBrand.get(brand) ?? 0) + rate.price);
        }
    }

    const nightlyRate = hotelNights > 0 && hotelSpend > 0 ? Math.round(hotelSpend / hotelNights) : null;
    const price = Number(tour?.price) || 0;

    // The brand the itinerary commits the most budget to, not merely the most
    // nights — one Six Senses night outweighs two roadside lodges.
    let signatureStay: string | null = null;
    let topSpend = 0;
    for (const [brand, spend] of spendByBrand) {
        if (spend > topSpend) {
            topSpend = spend;
            signatureStay = brand;
        }
    }

    return {
        days,
        nights,
        hotelNights,
        nightlyRate,
        perDay: days > 0 && price > 0 ? Math.round(price / days) : null,
        tier: tierForNightlyRate(nightlyRate),
        signatureStay,
    };
}
