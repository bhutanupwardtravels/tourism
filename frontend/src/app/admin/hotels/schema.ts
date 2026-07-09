import { z } from "zod";

export const hotelSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  slug: z.string().optional(),
  location: z.string().optional(),
  description: z.string(),
  image: z.string(),
  destination: z.string().optional(), // Destination ID
  destinationSlug: z.string().optional(), // Legacy field for backwards compatibility
  destinationId: z.string().optional(), // Alternative field name
  resolvedDestinationName: z.string().optional(),
  resolvedDestinationSlug: z.string().optional(),
  rating: z.number().min(1).max(5),
  amenities: z.array(z.string()).optional(),
  priceRange: z.string(), // Making it a string for maximum leniency since we have mixed data
  rooms: z.number().optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  gallery: z.array(z.string()).optional(),
  priority: z.number().optional(),
  price: z.number().optional(),
  createdAt: z.union([z.string(), z.date(), z.null()]).optional(),
  updatedAt: z.union([z.string(), z.date(), z.null()]).optional(),
});

export type Hotel = z.infer<typeof hotelSchema>;

export interface PaginatedHotels {
  items: Hotel[];
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
