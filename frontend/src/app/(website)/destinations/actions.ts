"use server";

import * as destDb from "@/lib/data/destinations";
import * as expDb from "@/lib/data/experiences";
import * as hotelDb from "@/lib/data/hotels";
import { Destination, Experience, Hotel } from "./schema";

export async function getDestinations(): Promise<Destination[]> {
  try {
    const data = await destDb.getAllDestinations();
    return data as Destination[];
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}

export async function getDestinationBySlug(
  slug: string
): Promise<Destination | null> {
  try {
    const destination = await destDb.getDestinationBySlug(slug);
    return destination as Destination | null;
  } catch (error) {
    console.error("Error fetching destination:", error);
    return null;
  }
}

export async function getDestinationsByRegion(
  region: string
): Promise<Destination[]> {
  try {
    const all = await destDb.getAllDestinations();
    return all.filter((d) => d.region === region) as Destination[];
  } catch (error) {
    console.error("Error fetching destinations by region:", error);
    return [];
  }
}

export async function getFeaturedDestinations(
  limit: number = 4
): Promise<Destination[]> {
  try {
    const all = await destDb.getAllDestinations();
    // Sort by priority (descending)
    const sorted = [...all].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return sorted.slice(0, limit) as Destination[];
  } catch (error) {
    console.error("Error fetching featured destinations:", error);
    return [];
  }
}

export async function getAllDestinations(): Promise<Destination[]> {
  try {
    const data = await destDb.getAllDestinations();
    return data as Destination[];
  } catch (error) {
    console.error("Error fetching all destinations:", error);
    return [];
  }
}

export async function getExperiencesByDestination(
  destinationId?: string,
  slug?: string
): Promise<Experience[]> {
  try {
    const data = await expDb.getExperiencesByDestination(destinationId, slug);
    return data as Experience[];
  } catch (error) {
    console.error("Error fetching experiences by destination:", error);
    return [];
  }
}

export async function getHotelsByDestination(destinationId?: string, slug?: string): Promise<Hotel[]> {
  try {
    const data = await hotelDb.getHotelsByDestination(destinationId, slug);
    return data as Hotel[];
  } catch (error) {
    console.error("Error fetching hotels by destination:", error);
    return [];
  }
}


