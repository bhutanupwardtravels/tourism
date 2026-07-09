import { z } from "zod";

export const aboutSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  content: z.array(z.string()),
  image: z.string().optional(),
  order: z.number(),
});

export const missionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
});

export const heroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  backgroundImage: z.string(),
});

export const whyBhutanItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  order: z.number(),
});

export const sustainabilityItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
});

export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type MissionItem = z.infer<typeof missionItemSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type WhyBhutanItem = z.infer<typeof whyBhutanItemSchema>;
export type SustainabilityItem = z.infer<typeof sustainabilityItemSchema>;
