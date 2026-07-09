import { z } from "zod";

export const experienceSchema = z.object({
  _id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.string().optional(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  destinationSlug: z.string().optional(),
  destinations: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  price: z.number().optional(),
  priority: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: any;
};
