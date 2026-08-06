import { z } from "zod";

export const testimonialSchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    role: z.string().optional(),
    quote: z.string().min(1, "Quote is required"),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    isFeatured: z.boolean().default(true),
    priority: z.number().default(0),
    createdAt: z.union([z.string(), z.date(), z.null()]).optional(),
    updatedAt: z.union([z.string(), z.date(), z.null()]).optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export interface PaginatedTestimonials {
    items: Testimonial[];
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}
