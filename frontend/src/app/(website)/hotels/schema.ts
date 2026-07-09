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
    rating: z.number().min(1).max(5),
    amenities: z.array(z.string()).optional(),
    priceRange: z.string(),
    rooms: z.number().optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
    gallery: z.array(z.string()).optional(),
    priority: z.number().optional(),
});

export type Hotel = z.infer<typeof hotelSchema>;
