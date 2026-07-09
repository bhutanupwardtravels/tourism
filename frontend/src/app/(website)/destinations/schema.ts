import { z } from "zod";

export const destinationSchema = z.object({
  _id: z.string().optional(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  region: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  priority: z.number().optional().default(99),
});

export const experienceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.string().optional(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  destinationSlug: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  priority: z.number().optional(),
});

export const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  destinationSlug: z.string(),
  rating: z.number().min(1).max(5),
  priceRange: z.enum(["$$", "$$$", "$$$$"]),
  priority: z.number().optional(),
});

export type Destination = z.infer<typeof destinationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Hotel = z.infer<typeof hotelSchema>;

