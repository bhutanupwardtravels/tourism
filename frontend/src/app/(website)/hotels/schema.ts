import { z } from "zod";

export const hotelSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    location: z.string().optional(),
    description: z.string(),
    image: z.string(),
    destination: z.string().optional(), // Destination ID
    destinationSlug: z.string().optional(), // Legacy field
    destinationId: z.string().optional(), // Alternative field name
    // Attached by lib/data/hotels resolveDestinations() on every read, so the
    // public schema should admit them the way the admin one already does.
    resolvedDestinationName: z.string().optional(),
    resolvedDestinationSlug: z.string().optional(),
    rating: z.number().min(1).max(5),
    amenities: z.array(z.string()).optional(),
    priceRange: z.string(),
    // Stored on the row and already surfaced by HotelCard; the public schema
    // had simply never been updated to admit it.
    price: z.number().optional(),
    rooms: z.number().optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
    gallery: z.array(z.string()).optional(),
    priority: z.number().optional(),
});

export type Hotel = z.infer<typeof hotelSchema>;
