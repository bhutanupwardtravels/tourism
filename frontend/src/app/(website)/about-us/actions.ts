"use server";

import { getAboutContent as getAboutContentFromDB } from "@/lib/data/about";

// Main action for fetching about content from database
export async function getAboutContent() {
  try {
    const content = await getAboutContentFromDB();
    return content;
  } catch (error) {
    console.error("Error fetching about content:", error);
    throw new Error("Failed to fetch about content");
  }
}
