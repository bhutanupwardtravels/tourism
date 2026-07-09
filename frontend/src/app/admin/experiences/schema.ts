import { z } from "zod";

export const experienceSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.string().optional(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).optional(),
  coordinates: z.tuple([z.number(), z.number()]).nullable().optional(),
  destinationSlug: z.string().optional(),
  destinations: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  priority: z.number().optional(),
  price: z.number().optional(),
  createdAt: z.union([z.string(), z.date(), z.null()]).optional(),
  updatedAt: z.union([z.string(), z.date(), z.null()]).optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export interface PaginatedExperiences {
  items: Experience[];
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
