import { supabaseAdmin } from "../supabase/admin";

// Each helper calls the increment_priority() SQL function (defined in the
// Supabase migration) for an atomic priority bump.

async function incrementPriority(table: string, id: string): Promise<boolean> {
    try {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase.rpc("increment_priority", {
            p_table: table,
            p_id: id,
        });
        if (error) throw error;
        return data === true;
    } catch (error) {
        console.error(`Failed to increment ${table} priority for ${id}:`, error);
        return false;
    }
}

/**
 * Increment the priority of a tour by 1
 */
export async function incrementTourPriority(tourId: string): Promise<boolean> {
    return incrementPriority("tours", tourId);
}

/**
 * Increment the priority of an experience by 1
 */
export async function incrementExperiencePriority(experienceId: string): Promise<boolean> {
    return incrementPriority("experiences", experienceId);
}

/**
 * Increment the priority of a destination by 1
 */
export async function incrementDestinationPriority(destinationId: string): Promise<boolean> {
    return incrementPriority("destinations", destinationId);
}

/**
 * Increment the priority of a hotel by 1
 */
export async function incrementHotelPriority(hotelId: string): Promise<boolean> {
    return incrementPriority("hotels", hotelId);
}

/**
 * Increment priorities for multiple items in parallel
 * Extracts unique IDs and increments each priority by 1
 */
export async function incrementMultiplePriorities(
    experienceIds: string[] = [],
    destinationIds: string[] = [],
    hotelIds: string[] = []
): Promise<void> {
    const uniqueExperiences = [...new Set(experienceIds.filter(Boolean))];
    const uniqueDestinations = [...new Set(destinationIds.filter(Boolean))];
    const uniqueHotels = [...new Set(hotelIds.filter(Boolean))];

    const promises: Promise<boolean>[] = [
        ...uniqueExperiences.map((id) => incrementExperiencePriority(id)),
        ...uniqueDestinations.map((id) => incrementDestinationPriority(id)),
        ...uniqueHotels.map((id) => incrementHotelPriority(id)),
    ];

    await Promise.allSettled(promises);
}
