"use server";

import * as destinationDb from "@/lib/data/destinations";
import * as experienceDb from "@/lib/data/experiences";
import { packages as packagesData } from "@/lib/data/packages";


export async function getTopDestinations(limit: number = 4) {
  try {
    const all = await destinationDb.getAllDestinations();
    return all.slice(0, limit);
  } catch (error) {
    console.error("Error fetching top destinations:", error);
    return [];
  }
}

export async function getTopExperiences(limit: number = 3) {
  try {
    const all = await experienceDb.getAllExperiences();
    return all.slice(0, limit);
  } catch (error) {
    console.error("Error fetching top experiences:", error);
    return [];
  }
}

import * as hotelDb from "@/lib/data/hotels";

export async function getBestHotels(limit: number = 6) {
  try {
    const all = await hotelDb.getAllHotels();
    return all
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching best hotels:", error);
    return [];
  }
}

export async function getFeaturedPackages(limit: number = 3) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return packagesData.slice(0, limit);
  } catch (error) {
    console.error("Error fetching featured packages:", error);
    return [];
  }
}

export async function getCompanyInfo() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      name: "Bhutan Travel Co.",
      tagline: "Discover the Kingdom of Happiness",
      description:
        "We are dedicated to crafting transformative journeys that honor Bhutan's rich cultural heritage, pristine environment, and the philosophy of Gross National Happiness. Each experience is thoughtfully curated to create meaningful connections between travelers and the Kingdom of the Thunder Dragon.",
      mission:
        "To provide authentic, sustainable, and transformative travel experiences that benefit both travelers and local communities.",
      established: "2010",
    };
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
}
