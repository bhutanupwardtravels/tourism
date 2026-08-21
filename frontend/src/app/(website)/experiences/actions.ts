"use server";

import * as db from "@/lib/data/experiences";
import * as typeDb from "@/lib/data/experience-types";
import * as hotelDb from "@/lib/data/hotels";
import { Experience } from "@/app/admin/experiences/schema";
import { ExperienceType } from "@/app/admin/experience-types/schema";
import { Hotel } from "@/app/admin/hotels/schema";

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

// Supabase experience-type ids are uuids; 24-hex ids are legacy Mongo ObjectIds.
const CATEGORY_ID_RE = /^([0-9a-f]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

async function resolveExperienceCategory<T extends { category?: string }>(experience: T) {
  if (experience && experience.category && CATEGORY_ID_RE.test(experience.category)) {
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
    // listExperiences already orders by priority desc, so page one is the top N.
    const data = await db.listExperiences(1, limit);
    const resolved = await Promise.all(data.items.map(resolveExperienceCategory));
    return resolved as Experience[];
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

/**
 * Places to stay near where an experience happens. The experience links to its
 * destinations through `destinations` (ids or slugs) plus the legacy
 * `destinationSlug`, so every reference it carries is handed to the hotel
 * lookup and matched against whichever column the hotel row uses.
 */
export async function getHotelsForExperience(slug: string): Promise<Hotel[]> {
  try {
    // Cached alongside the page's own lookup, so this costs no extra query.
    const experience = await db.getExperienceBySlug(slug);
    if (!experience) return [];

    const hotels = await hotelDb.getHotelsByDestinationRefs([
      experience.destinationSlug,
      ...(experience.destinationIds ?? []),
      ...(experience.resolvedDestinations ?? []),
    ]);

    return [...hotels].sort(
      (a, b) =>
        (b.priority || 0) - (a.priority || 0) ||
        (Number(b.rating) || 0) - (Number(a.rating) || 0)
    ) as Hotel[];
  } catch (error) {
    console.error("Error fetching hotels for experience:", error);
    return [];
  }
}
