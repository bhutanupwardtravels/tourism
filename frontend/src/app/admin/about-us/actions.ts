"use server";

import { revalidatePath } from "next/cache";
import { getAboutContent, updateAboutContent, AboutContent } from "@/lib/data/about";
import { uploadImage } from "@/lib/upload";

export async function getAboutContentAction() {
  try {
    const content = await getAboutContent();
    // Serialize the data to plain objects
    return JSON.parse(JSON.stringify(content));
  } catch (error) {
    throw new Error("Failed to fetch about content");
  }
}

export async function updateAboutContentAction(formData: FormData) {
  try {
    // Extract form fields
    const getValue = (key: string) => formData.get(key) as string;

    // Handle image uploads
    const handleImage = async (fileKey: string, existingKey: string) => {
      const file = formData.get(fileKey);
      if (file instanceof File && file.size > 0) {
        const uploadedPath = await uploadImage(file);
        return uploadedPath || getValue(existingKey);
      }
      return getValue(existingKey);
    };

    const heroImage = await handleImage("heroImage", "existingHeroImage");
    const storyImage = await handleImage("storyImage", "existingStoryImage");
    const purposeImage = await handleImage("purposeImage", "existingPurposeImage");
    const sustainableImage = await handleImage("sustainableImage", "existingSustainableImage");

    const missionItems = JSON.parse(getValue("missionItems") || "[]");
    const sustainableItems = JSON.parse(getValue("sustainableItems") || "[]");

    const data: AboutContent = {
      hero: {
        title: getValue("hero-title"),
        subtitle: getValue("hero-subtitle"),
        content: getValue("hero-content"),
        image: heroImage,
      },
      story: {
        title: getValue("story-title"),
        subtitle: getValue("story-subtitle"),
        content: getValue("story-content"),
        image: storyImage,
      },
      mission: {
        title: getValue("mission-title"),
        subtitle: getValue("mission-subtitle"),
        image: "",
        items: missionItems,
      },
      purpose: {
        title: getValue("purpose-title"),
        subtitle: getValue("purpose-subtitle"),
        content: getValue("purpose-content"),
        image: purposeImage,
      },
      sustainable: {
        title: getValue("sustainable-title"),
        subtitle: getValue("sustainable-subtitle"),
        intro: getValue("sustainable-intro"),
        image: sustainableImage,
        items: sustainableItems,
      },
    };

    await updateAboutContent(data);

    revalidatePath("/admin/about-us");
    revalidatePath("/about-us");

    return { success: true, message: "Content updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update content" };
  }
}
