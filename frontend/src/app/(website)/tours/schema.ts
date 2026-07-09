import { z } from "zod";

// Experience schema for day activities
export const experienceSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  category: z.string().optional(),
});

// Tour day schema
export const tourDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
  accommodation: z.string().optional(),
  activities: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  experiences: z.array(experienceSchema).optional(),
});

// Main tour schema
export const tourSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(), // Make ID optional as _id is usually the primary key in Mongo
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  duration: z.string(),
  price: z.preprocess((val) => {
    if (typeof val === 'string') {
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
  featured: z.preprocess((val) => {
    // Backward compatibility for featured boolean -> simplified logic if needed or just keep optional
    return val === true;
  }, z.boolean().optional()),
  category: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  days: z.array(tourDaySchema),
});

// Export TypeScript types
export type Experience = z.infer<typeof experienceSchema>;
export type TourDay = z.infer<typeof tourDaySchema>;
export type Tour = z.infer<typeof tourSchema>;
