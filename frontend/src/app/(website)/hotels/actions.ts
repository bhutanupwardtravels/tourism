"use server";

import * as hotelDb from "@/lib/data/hotels";
import { Hotel } from "./schema";

export async function getHotels(page: number = 1, pageSize: number = 12) {
    try {
        const data = await hotelDb.listHotels(page, pageSize);
        return data;
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return {
            items: [],
            page,
            page_size: pageSize,
            total_pages: 0,
            has_next: false,
            has_prev: false,
            total_items: 0,
        };
    }
}

export async function getHotelById(id: string): Promise<Hotel | null> {
    try {
        const hotel = await hotelDb.getHotelById(id);
        return hotel as Hotel | null;
    } catch (error) {
        console.error("Error fetching hotel by id:", error);
        return null;
    }
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
    try {
        const hotel = await hotelDb.getHotelBySlug(slug);
        return hotel as Hotel | null;
    } catch (error) {
        console.error("Error fetching hotel by slug:", error);
        return null;
    }
}

export async function getRelatedHotels(destinationIdOrSlug: string | undefined, excludeId: string | undefined, limit: number = 6): Promise<Hotel[]> {
    try {
        // Filtered in Postgres against every legacy destination column, the same
        // path the destination and experience pages use. This previously pulled
        // the whole hotels table and matched on `destination || destinationSlug`
        // in JS, which missed rows that only carry `destination_id`.
        const matches = await hotelDb.getHotelsByDestinationRefs([destinationIdOrSlug]);
        return matches
            .filter((h) => h.id !== excludeId)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0))
            .slice(0, limit) as Hotel[];
    } catch (error) {
        console.error("Error fetching related hotels:", error);
        return [];
    }
}

export async function getAllHotels(): Promise<Hotel[]> {
    try {
        const data = await hotelDb.getAllHotels();
        return data as Hotel[];
    } catch (error) {
        console.error("Error fetching all hotels:", error);
        return [];
    }
}

/**
 * Properties are named "Amankora (Paro)", "Six Senses (Bumthang)" and so on,
 * so the brand is whatever precedes the parenthesised location.
 */
function hotelBrand(name: string): string {
    return name.split("(")[0].trim().toLowerCase() || name.toLowerCase();
}

export async function getBestHotels(limit: number = 6): Promise<Hotel[]> {
    try {
        // Every showcase hotel currently shares priority 11, so the underlying
        // query's name tiebreak decided the row alphabetically — which returned
        // five consecutive Amankora properties. Rank on rating within priority
        // and show one property per brand, so the row reads as a catalogue
        // rather than one operator's alphabet.
        const pool = await hotelDb.getTopHotels(limit * 8);
        const ranked = ([...pool] as Hotel[]).sort(
            (a, b) =>
                (b.priority || 0) - (a.priority || 0) ||
                (Number(b.rating) || 0) - (Number(a.rating) || 0)
        );

        const seen = new Set<string>();
        const distinct = ranked.filter((hotel) => {
            const brand = hotelBrand(hotel.name);
            if (seen.has(brand)) return false;
            seen.add(brand);
            return true;
        });

        const selected = distinct.slice(0, limit);
        if (selected.length < limit) {
            // Thin catalogue: fall back to filling the row with repeats rather
            // than rendering a short one.
            const chosen = new Set(selected);
            selected.push(
                ...ranked.filter((h) => !chosen.has(h)).slice(0, limit - selected.length)
            );
        }
        return selected;
    } catch (error) {
        console.error("Error fetching best hotels:", error);
        return [];
    }
}
