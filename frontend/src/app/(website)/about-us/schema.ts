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

export const trustItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
});

export const founderSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  name: z.string(),
  role: z.string().optional(),
  nationality: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string(),
  image: z.string().optional(),
});

export const credentialsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  licenseNumber: z.string().optional(),
  foundingYear: z.string().optional(),
  guideCredentials: z.string().optional(),
  emergencySupport: z.string().optional(),
  items: z.array(trustItemSchema),
});

export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type MissionItem = z.infer<typeof missionItemSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type WhyBhutanItem = z.infer<typeof whyBhutanItemSchema>;
export type TrustItem = z.infer<typeof trustItemSchema>;
export type Founder = z.infer<typeof founderSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;
