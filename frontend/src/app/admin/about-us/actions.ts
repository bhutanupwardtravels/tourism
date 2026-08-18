"use server";

import { revalidatePath } from "next/cache";
import { getAboutContent, updateAboutContent, AboutContent } from "@/lib/data/about";
import { uploadImage } from "@/lib/upload";

export async function getAboutContentAction() {
  try {
    const content = await getAboutContent();
    // Serialize the data to plain objects
    return JSON.parse(JSON.stringify(content));
  } catch {
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
    const founderImage = await handleImage("founderImage", "existingFounderImage");
    const purposeImage = await handleImage("purposeImage", "existingPurposeImage");

    const missionItems = JSON.parse(getValue("missionItems") || "[]");
    const trustItems = JSON.parse(getValue("trustItems") || "[]");
    const whyBhutanItems = JSON.parse(getValue("whyBhutanItems") || "[]");

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
      founder: {
        title: getValue("founder-title"),
        subtitle: getValue("founder-subtitle"),
        name: getValue("founder-name"),
        role: getValue("founder-role"),
        nationality: getValue("founder-nationality"),
        experience: getValue("founder-experience"),
        bio: getValue("founder-bio"),
        image: founderImage,
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
      credentials: {
        title: getValue("credentials-title"),
        subtitle: getValue("credentials-subtitle"),
        licenseNumber: getValue("credentials-license"),
        foundingYear: getValue("credentials-founding-year"),
        guideCredentials: getValue("credentials-guides"),
        emergencySupport: getValue("credentials-emergency"),
        items: trustItems,
      },
      whyBhutan: {
        title: getValue("whybhutan-title"),
        subtitle: getValue("whybhutan-subtitle"),
        items: whyBhutanItems,
      },
    };

    await updateAboutContent(data);

    revalidatePath("/admin/about-us");
    revalidatePath("/about-us");
    // Founder/license/foundingYear also feed the sitewide Organization JSON-LD
    // rendered from the (website) layout — bust that too, same as contact does.
    revalidatePath("/", "layout");

    return { success: true, message: "Content updated successfully" };
  } catch {
    return { success: false, message: "Failed to update content" };
  }
}
