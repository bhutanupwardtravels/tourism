import { Cost } from "@/app/admin/settings/schema";
import { DayItinerary } from "@/app/admin/tour-requests/types";

/**
 * Trip quote maths.
 *
 * This lives outside the builder component so the browser (which renders the
 * estimate live) and `submitTourRequest` (which stores the authoritative
 * figures) run the exact same arithmetic and can never drift. The server always
 * recomputes from its own copy of the catalogue — a client-supplied total is
 * never trusted.
 */

// Only the fields the maths needs. Experiences and hotels have much wider
// shapes; structural typing keeps this module free of those imports.
export interface PricedItem {
    _id?: string;
    slug?: string;
    price?: number;
}

export interface QuoteLine {
    label: string;
    price: number;
}

export interface FeesResult {
    total: number;
    breakdown: QuoteLine[];
}

export interface FeesInput {
    costs: Cost[];
    country?: string;
    adults?: number;
    children_6_12?: number;
    children_under_6?: number;
    arrivalDate?: string;
    departureDate?: string;
}

export interface QuoteInput extends FeesInput {
    customItinerary?: DayItinerary[];
    experiences?: PricedItem[];
    hotels?: PricedItem[];
}

export interface Quote {
    subtotal: number;
    fees: number;
    itineraryTotal: number;
    breakdown: QuoteLine[];
}

export interface DiscountResult {
    discountPercent: number;
    discountAmount: number;
    total: number;
}

/**
 * Government / operator fees from `global_costs`, matched on nationality and
 * traveller category. `daily` costs multiply by the trip length (nights + 1);
 * `fixed` costs are charged once per traveller.
 */
export function computeFees({
    costs,
    country,
    adults = 0,
    children_6_12 = 0,
    children_under_6 = 0,
    arrivalDate,
    departureDate,
}: FeesInput): FeesResult {
    if (!arrivalDate || !departureDate) return { total: 0, breakdown: [] };

    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    const nights = Math.max(
        0,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    const daysCount = nights + 1;

    let total = 0;
    const breakdown: QuoteLine[] = [];

    (costs || []).forEach((cost) => {
        // Nationality is a strict binary: Indian nationals pay a different
        // SDF/fee schedule to everyone else.
        if (cost.isIndianNational !== (country === "IN")) return;

        let count = 0;
        if (cost.travelerCategory === "adult") count = adults;
        else if (cost.travelerCategory === "child_6_12") count = children_6_12;
        else if (cost.travelerCategory === "child_under_6") count = children_under_6;

        if (count <= 0) return;

        const base = (cost.price || 0) * count;
        const lineTotal = cost.type === "daily" ? base * daysCount : base;
        total += lineTotal;
        breakdown.push({ label: `${cost.title} (${count}x)`, price: lineTotal });
    });

    return { total, breakdown };
}

/** Sum of every experience and hotel placed on the itinerary, charged once per placement. */
export function computeItineraryTotal({
    customItinerary = [],
    experiences = [],
    hotels = [],
}: Pick<QuoteInput, "customItinerary" | "experiences" | "hotels">): number {
    let total = 0;

    (customItinerary || []).forEach((day) => {
        (day?.items || []).forEach((item) => {
            if (item.experienceId) {
                const match = experiences.find(
                    (e) => e._id === item.experienceId || e.slug === item.experienceId
                );
                total += match?.price || 0;
            }
            if (item.hotelId) {
                const match = hotels.find(
                    (h) => h._id === item.hotelId || h.slug === item.hotelId
                );
                total += match?.price || 0;
            }
        });
    });

    return total;
}

/** Full pre-discount quote: fees plus everything on the itinerary. */
export function buildQuote(input: QuoteInput): Quote {
    const { total: fees, breakdown } = computeFees(input);
    const itineraryTotal = computeItineraryTotal(input);

    return {
        subtotal: fees + itineraryTotal,
        fees,
        itineraryTotal,
        breakdown,
    };
}

/**
 * Apply a percentage discount, rounded to whole currency units so the figure
 * quoted on screen, stored in the DB and printed in the email always agree.
 */
export function applyDiscount(subtotal: number, percent: number): DiscountResult {
    const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
    if (safePercent === 0 || subtotal <= 0) {
        return { discountPercent: 0, discountAmount: 0, total: Math.round(subtotal) };
    }

    const discountAmount = Math.round((subtotal * safePercent) / 100);
    return {
        discountPercent: safePercent,
        discountAmount,
        total: Math.round(subtotal) - discountAmount,
    };
}
