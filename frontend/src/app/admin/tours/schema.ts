import { z } from "zod";

export const travelSchema = z.object({
    from: z.string(),
    to: z.string(),
    duration: z.number().optional(),
    // Filled in server-side from the linked destinations so the day page can
    // draw the leg on a map; not something the form ever writes.
    fromCoordinates: z.tuple([z.number(), z.number()]).nullable().optional(),
    toCoordinates: z.tuple([z.number(), z.number()]).nullable().optional(),
    // Legacy free-text notes from itineraries written before travel legs were
    // linked to destinations. Still rendered on the day page where present.
    location: z.string().optional(),
    timing: z.string().optional(),
});

export const itineraryItemSchema = z.object({
    id: z.string().optional(),
    type: z.enum(["experience", "travel"]),
    order: z.number(),
    experienceId: z.string().optional(),
    experience: z.object({
        title: z.string(),
        duration: z.string().optional(),
        image: z.string().optional(),
    }).optional(),
    hotelId: z.string().optional(),
    hotel: z.object({
        name: z.string(),
        image: z.string().optional(),
    }).optional(),
    destinationFromId: z.string().optional(),
    destinationToId: z.string().optional(),
    travel: travelSchema.optional(),
});

export const tourDaySchema = z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(), // URL for the day's image
    hotelId: z.string().optional(), // Link to a Hotel entity for overnight stay
    items: z.array(itineraryItemSchema).default([]),
    // Legacy fields for backward compatibility/quick fallback
    accommodation: z.string().optional(),
    activities: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
});

export const tourSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(), // Cover image URL
    duration: z.string(),
    price: z.preprocess((val) => {
        if (typeof val === 'string') {
            // Remove non-numeric chars except dot
            const cleaned = val.replace(/[^0-9.]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
        }
        if (typeof val === 'number') return val;
        return 0;
    }, z.number()),
    priority: z.preprocess((val) => {
        if (typeof val === 'string') {
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
        }
        if (typeof val === 'number') return val;
        return 0;
    }, z.number().default(0)),
    category: z.string().optional(),
    // NOTE: there is no `featured` column on the tours table, so this is always
    // undefined today. It is declared because three callers already read it
    // (tours-grid sorting, getFeaturedTour, plan-my-trip packages) and each has
    // a priority-based fallback; add the column to make the flag do anything.
    featured: z.boolean().optional(),
    // Resolved server-side from the category's experience type; never persisted
    categoryTitle: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    days: z.array(tourDaySchema),
    selectedCostIds: z.array(z.string()).default([]),
    createdAt: z.union([z.string(), z.date(), z.null()]).optional(),
    updatedAt: z.union([z.string(), z.date(), z.null()]).optional(),
});

export type Tour = z.output<typeof tourSchema>;

/**
 * The tour as the form holds it mid-edit. `price`/`priority` go through
 * `z.preprocess`, so on the way in they are whatever the input rendered and
 * only become numbers once validated.
 */
export type TourInput = z.input<typeof tourSchema>;
export type TourDay = z.infer<typeof tourDaySchema>;
export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type Travel = z.infer<typeof travelSchema>;

export interface PaginatedTours {
    items: Tour[];
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}
