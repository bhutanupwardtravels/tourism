"use server";

import { ActionResponse } from "./schema";
import * as db from "@/lib/data/experiences";
import * as typeDb from "@/lib/data/experience-types";
import { Experience } from "@/app/admin/experiences/schema";
import { ExperienceType } from "@/app/admin/experience-types/schema";

export async function getExperienceTypes(): Promise<ExperienceType[]> {
  try {
    const data = await typeDb.listExperienceTypes(1, 10);
    return data.items as ExperienceType[];
  } catch (error) {
    console.error("Error fetching experience types:", error);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const data = await db.listExperiences(1, 100);
    return data.items as Experience[];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

async function resolveExperienceCategory(experience: any) {
  if (experience && experience.category && experience.category.length === 24) {
    const categoryDoc = await typeDb.getExperienceTypeById(experience.category);
    if (categoryDoc) {
      experience.category = categoryDoc.title;
    }
  }
  return experience;
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  try {
    const experience = await db.getExperienceBySlug(slug);
    if (experience) await resolveExperienceCategory(experience);
    return experience as Experience | null;
  } catch (error) {
    console.error("Error fetching experience:", error);
    return null;
  }
}

export async function getExperiencesByCategory(category: string): Promise<Experience[]> {
  try {
    const data = await db.listExperiences(1, 100);
    const resolved = await Promise.all(data.items.map(resolveExperienceCategory));
    if (category === "All") return resolved as Experience[];
    return (resolved as Experience[]).filter((e) => e.category === category);
  } catch (error) {
    console.error("Error fetching experiences by category:", error);
    return [];
  }
}

export async function getFeaturedExperiences(limit: number = 3): Promise<Experience[]> {
  try {
    const data = await db.listExperiences(1, 100);
    const resolved = await Promise.all(data.items.map(resolveExperienceCategory));
    const sorted = [...resolved].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return sorted.slice(0, limit) as Experience[];
  } catch (error) {
    console.error("Error fetching featured experiences:", error);
    return [];
  }
}

export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const data = await db.listExperiences(1, 1000);
    const resolved = await Promise.all(data.items.map(resolveExperienceCategory));
    return resolved as Experience[];
  } catch (error) {
    console.error("Error fetching all experiences:", error);
    return [];
  }
}
