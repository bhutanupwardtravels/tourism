import { z } from "zod";

export const destinationSchema = z.object({
  _id: z.string().optional(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  region: z.string(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  priority: z.number().default(99),
  isEntryPoint: z.boolean().default(false),
  createdAt: z.union([z.string(), z.date(), z.null()]).optional(),
  updatedAt: z.union([z.string(), z.date(), z.null()]).optional(),
});

export type Destination = z.infer<typeof destinationSchema>;

export interface PaginatedDestinations {
  items: Destination[];
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
