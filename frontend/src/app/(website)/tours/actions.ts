"use server";

import * as tourDb from "@/lib/data/tours";
import * as hotelDb from "@/lib/data/hotels";
import * as experienceDb from "@/lib/data/experiences";
import * as destinationDb from "@/lib/data/destinations";
import { Tour, TourDay } from "./schema";

import * as experienceTypeDb from "@/lib/data/experience-types";

// Supabase ids are uuids; 24-hex ids are legacy Mongo ObjectIds.
const DB_ID_RE = /^([0-9a-f]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

async function resolveTourCategory(tour: any) {
  if (tour && tour.category && DB_ID_RE.test(tour.category)) {
    const categoryDoc = await experienceTypeDb.getExperienceTypeById(tour.category);
    if (categoryDoc) {
      tour.category = categoryDoc.title;
    }
  }
  return tour;
}

export async function getAllTours(): Promise<Tour[]> {
  try {
    const all = await tourDb.getAllTours();
    const resolved = await Promise.all(all.map(resolveTourCategory));
    return resolved as Tour[];
  } catch (error) {
    console.error("Error fetching all tours:", error);
    throw new Error("Failed to fetch tours");
  }
}

export async function getTopPriorityTours(limit: number = 5): Promise<Tour[]> {
  try {
    const top = await tourDb.getTopTours(limit);
    const resolved = await Promise.all(top.map(resolveTourCategory));
    return resolved as Tour[];
  } catch (error) {
    console.error("Error fetching top priority tours:", error);
    throw new Error("Failed to fetch top priority tours");
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const tour = await tourDb.getTourBySlug(slug);
    if (tour) await resolveTourCategory(tour);
    return tour as Tour | null;
  } catch (error) {
    console.error(`Error fetching tour with slug ${slug}:`, error);
    throw new Error("Failed to fetch tour");
  }
}

export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const tour = await tourDb.getTourById(id);
    if (tour) await resolveTourCategory(tour);
    return tour as Tour | null;
  } catch (error) {
    console.error(`Error fetching tour with id ${id}:`, error);
    throw new Error("Failed to fetch tour by id");
  }
}

// Fills in travel.from/to (name) and travel.fromCoordinates/toCoordinates for one
// endpoint of a travel item. The destination id comes from destinationFromId/ToId
// when present, otherwise from an id-shaped travel.from/to value (legacy data).
async function resolveTravelPoint(item: any, side: "from" | "to") {
  const explicitId = side === "from" ? item.destinationFromId : item.destinationToId;
  const value = item.travel[side];
  const id = explicitId || (value && DB_ID_RE.test(value) ? value : null);
  if (!id) return;

  const dest = await destinationDb.getDestinationById(id);
  if (!dest) return;

  if (!value || DB_ID_RE.test(value)) item.travel[side] = dest.name;
  if (dest.coordinates) item.travel[`${side}Coordinates`] = dest.coordinates;
}

export async function getTourDay(
  slug: string,
  dayNumber: number
): Promise<{ dayData: any; tour: Tour; hotel?: any; experiences?: any[] } | null> {
  try {
    const tour = await tourDb.getTourBySlug(slug);
    if (!tour) return null;

    const dayData = tour.days.find((d: any) => d.day === dayNumber);
    if (!dayData) return null;

    // Resolve Hotel — check day-level hotelId first, then items array
    let hotel = null;
    if (dayData.hotelId) {
      hotel = await hotelDb.getHotelById(dayData.hotelId);
    } else if (dayData.items) {
      const hotelItem = dayData.items.find((item: any) => item.hotelId);
      if (hotelItem?.hotelId) {
        hotel = await hotelDb.getHotelById(hotelItem.hotelId);
      }
    }

    // Resolve Experiences and Travel Destinations from items. Items are
    // resolved in parallel; getDestinationById/getExperienceById are cache()'d
    // so repeated ids within the render collapse into one query each.
    const themeExperiences: any[] = [];
    if (dayData.items) {
      const resolved = await Promise.all(
        dayData.items.map(async (item: any) => {
          if (item.type === "experience" && item.experienceId) {
            return experienceDb.getExperienceById(item.experienceId);
          }
          if (item.type === "travel" && item.travel && !item.hotelId) {
            // New builder stores destinationFromId/destinationToId; legacy stored the ID in travel.from/to
            await Promise.all([
              resolveTravelPoint(item, "from"),
              resolveTravelPoint(item, "to"),
            ]);
          }
          return null;
        })
      );
      for (const exp of resolved) if (exp) themeExperiences.push(exp);
    }

    return {
      dayData,
      tour: tour as Tour,
      hotel,
      experiences: themeExperiences
    };
  } catch (error) {
    console.error(`Error fetching day ${dayNumber} for tour ${slug}:`, error);
    throw new Error("Failed to fetch tour day");
  }
}

export async function getRelatedTours(currentSlug: string, limit: number = 3): Promise<Tour[]> {
  try {
    const tours = await tourDb.getRelatedTours(currentSlug, limit);
    const resolved = await Promise.all(tours.map(resolveTourCategory));
    return resolved as Tour[];
  } catch (error) {
    console.error("Error fetching related tours:", error);
    throw new Error("Failed to fetch related tours");
  }
}

export async function getToursByCategory(category: string): Promise<Tour[]> {
  try {
    const all = await tourDb.getAllTours();
    return all.filter((tour: any) => tour.category === category) as Tour[];
  } catch (error) {
    console.error(`Error fetching tours by category ${category}:`, error);
    throw new Error("Failed to fetch tours by category");
  }
}

export async function getFeaturedTour(): Promise<Tour> {
  try {
    const all = await tourDb.getAllTours();
    const featured = all.find((tour: any) => tour.featured);
    return (await resolveTourCategory(featured || all[0])) as Tour;
  } catch (error) {
    console.error("Error fetching featured tour:", error);
    throw new Error("Failed to fetch featured tour");
  }
}
