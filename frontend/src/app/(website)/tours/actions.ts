"use server";

import * as tourDb from "@/lib/data/tours";
import * as hotelDb from "@/lib/data/hotels";
import * as experienceDb from "@/lib/data/experiences";
import * as destinationDb from "@/lib/data/destinations";
import { Tour, TourDay } from "./schema";

import * as experienceTypeDb from "@/lib/data/experience-types";

async function resolveTourCategory(tour: any) {
  if (tour && tour.category && tour.category.length === 24) {
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
    const all = await tourDb.getAllTours();
    const resolved = await Promise.all(all.slice(0, limit).map(resolveTourCategory));
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

    // Resolve Experiences and Travel Destinations from items
    const themeExperiences = [];
    if (dayData.items) {
      for (const item of dayData.items) {
        if (item.type === "experience" && item.experienceId) {
          const exp = await experienceDb.getExperienceById(item.experienceId);
          if (exp) themeExperiences.push(exp);
        }
        if (item.type === "travel" && item.travel && !item.hotelId) {
          // Resolve From coordinates — new builder uses destinationFromId, legacy used travel.from as ID
          if (item.destinationFromId) {
            const dest = await destinationDb.getDestinationById(item.destinationFromId);
            if (dest?.coordinates) item.travel.fromCoordinates = dest.coordinates;
          } else if (item.travel.from && item.travel.from.length === 24) {
            const dest = await destinationDb.getDestinationById(item.travel.from);
            if (dest) {
              item.travel.from = dest.name;
              if (dest.coordinates) item.travel.fromCoordinates = dest.coordinates;
            }
          }
          // Resolve To coordinates — new builder uses destinationToId, legacy used travel.to as ID
          if (item.destinationToId) {
            const dest = await destinationDb.getDestinationById(item.destinationToId);
            if (dest?.coordinates) item.travel.toCoordinates = dest.coordinates;
          } else if (item.travel.to && item.travel.to.length === 24) {
            const dest = await destinationDb.getDestinationById(item.travel.to);
            if (dest) {
              item.travel.to = dest.name;
              if (dest.coordinates) item.travel.toCoordinates = dest.coordinates;
            }
          }
        }
      }
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

export async function getRelatedTours(currentSlug: string): Promise<Tour[]> {
  try {
    const all = await tourDb.getAllTours();
    return all.filter((tour: any) => tour.slug !== currentSlug).slice(0, 3) as Tour[];
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
    return (featured || all[0]) as Tour;
  } catch (error) {
    console.error("Error fetching featured tour:", error);
    throw new Error("Failed to fetch featured tour");
  }
}
