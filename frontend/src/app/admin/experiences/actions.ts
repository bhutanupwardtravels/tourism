"use server";

import { revalidatePath } from "next/cache";
import { PaginatedExperiences, Experience } from "./schema";
import * as db from "@/lib/data/experiences";
import * as experienceTypeDb from "@/lib/data/experience-types";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { uploadImage, updateImage, deleteImage } from "@/lib/upload";

// Helper function to extract filename from image URL
function extractFilenameFromUrl(imageUrl: string): string | null {
  if (!imageUrl) return null;
  try {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    return filename && filename.length > 0 ? filename : null;
  } catch (error) {
    return null;
  }
}

export async function getExperiences(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  category?: string
): Promise<PaginatedExperiences> {
  try {
    const data = await db.listExperiences(page, pageSize, search, category);
    return data as PaginatedExperiences;
  } catch (error) {
    return {
      items: [],
      page: 1,
      page_size: pageSize,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    };
  }
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  try {
    const experience = await db.getExperienceBySlug(slug);
    return experience as Experience | null;
  } catch (error) {
    return null;
  }
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  try {
    const experience = await db.getExperienceById(id);
    return experience as Experience | null;
  } catch (error) {
    return null;
  }
}

export async function getAllExperiences() {
  try {
    const experiences = await db.getAllExperiences();
    return experiences;
  } catch (error) {
    return [];
  }
}

export async function createExperience(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;
    const difficulty = formData.get("difficulty") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const priorityStr = formData.get("priority") as string;
    const priceStr = formData.get("price") as string;

    const latStr = formData.get("latitude") as string;
    const lngStr = formData.get("longitude") as string;
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const destinationsStr = formData.get("destinations") as string;
    const destinations = JSON.parse(destinationsStr || "[]");

    // Handle image field correctly. formData.get("image") returns a File object if uploaded.
    const imageInput = formData.get("image");
    let imageUrl = "https://images.unsplash.com/photo-1581330560232-474c3e8a4a58"; // Fallback placeholder

    if (imageInput instanceof File && imageInput.size > 0) {
      const uploadedPath = await uploadImage(imageInput);
      if (uploadedPath) {
        imageUrl = uploadedPath;
      }
    }

    // Handle gallery images
    const galleryFiles = formData.getAll("gallery");
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      if (file instanceof File && file.size > 0) {
        const uploadedPath = await uploadImage(file);
        if (uploadedPath) {
          galleryUrls.push(uploadedPath);
        }
      }
    }

    const experienceData: any = {
      title,
      slug,
      category,
      description,
      duration,
      difficulty: difficulty as any,
      destinations,
      image: imageUrl,
      startDate,
      endDate,
      priority: priorityStr ? Number(priorityStr) : undefined,
      price: priceStr ? Number(priceStr) : undefined,
    };

    if (galleryUrls.length > 0) {
      experienceData.gallery = galleryUrls;
    }

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      experienceData.coordinates = [latitude, longitude];
    }

    await db.createExperience(experienceData);

    revalidatePath("/admin/experiences");
    revalidatePath("/experiences");
    revalidatePath("/");

    return {
      success: true,
      message: "Experience created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create experience",
    };
  }
}

export async function updateExperience(
  id: string,
  prevState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;
    const difficulty = formData.get("difficulty") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const priorityStr = formData.get("priority") as string;
    const priceStr = formData.get("price") as string;

    const latStr = formData.get("latitude") as string;
    const lngStr = formData.get("longitude") as string;
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const destinationsStr = formData.get("destinations") as string;
    const destinations = JSON.parse(destinationsStr || "[]");

    const imageInput = formData.get("image");
    // Get existing experience to keep image if not changed
    const existingExperience = await db.getExperienceById(id);
    let imageUrl = existingExperience?.image || "https://images.unsplash.com/photo-1581330560232-474c3e8a4a58";

    if (imageInput instanceof File && imageInput.size > 0) {
      const existingImageFilename = extractFilenameFromUrl(existingExperience?.image || "");

      if (existingImageFilename) {
        const uploadedPath = await updateImage(existingImageFilename, imageInput);
        if (uploadedPath) {
          imageUrl = uploadedPath;
        } else {
          const newPath = await uploadImage(imageInput);
          if (newPath) imageUrl = newPath;
        }
      } else {
        const uploadedPath = await uploadImage(imageInput);
        if (uploadedPath) {
          imageUrl = uploadedPath;
        }
      }
    }

    // Handle gallery images
    const existingGalleryStr = formData.get("existingGallery") as string;
    const existingGallery = JSON.parse(existingGalleryStr || "[]");

    const newGalleryFiles = formData.getAll("gallery");
    const newGalleryUrls: string[] = [];

    for (const file of newGalleryFiles) {
      if (file instanceof File && file.size > 0) {
        const uploadedPath = await uploadImage(file);
        if (uploadedPath) {
          newGalleryUrls.push(uploadedPath);
        }
      }
    }

    // Combine existing and new gallery images
    const galleryUrls = [...existingGallery, ...newGalleryUrls];

    // Delete removed gallery images
    if (existingExperience?.gallery && existingExperience.gallery.length > 0) {
      for (const galleryImage of existingExperience.gallery) {
        // Check if this image is no longer in the gallery
        if (!galleryUrls.includes(galleryImage)) {
          const imageFilename = extractFilenameFromUrl(galleryImage);
          if (imageFilename) {
            await deleteImage(imageFilename);
          }
        }
      }
    }

    const experienceData: any = {
      title,
      slug,
      category,
      description,
      duration,
      difficulty: difficulty as any,
      destinations,
      image: imageUrl,
      startDate,
      endDate,
      priority: priorityStr ? Number(priorityStr) : undefined,
      price: priceStr ? Number(priceStr) : undefined,
    };

    if (galleryUrls.length > 0) {
      experienceData.gallery = galleryUrls;
    }

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      experienceData.coordinates = [latitude, longitude];
    }

    await db.updateExperience(id, experienceData);

    revalidatePath("/admin/experiences");
    revalidatePath("/experiences");
    revalidatePath("/");
    revalidatePath(`/admin/experiences/${id}`);
    revalidatePath(`/admin/experiences/${id}/edit`);

    return {
      success: true,
      message: "Experience updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update experience",
    };
  }
}



export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Get experience to delete its images
    const experience = await db.getExperienceById(id);

    // Delete main image
    if (experience?.image) {
      const imageFilename = extractFilenameFromUrl(experience.image);
      if (imageFilename) {
        const deleted = await deleteImage(imageFilename);
        if (!deleted) {
          // Silent fail
        }
      }
    }

    // Delete gallery images
    if (experience?.gallery && Array.isArray(experience.gallery)) {
      for (const galleryImage of experience.gallery) {
        const galleryFilename = extractFilenameFromUrl(galleryImage);
        if (galleryFilename) {
          const deleted = await deleteImage(galleryFilename);
          if (!deleted) {
            // Silent fail
          }
        }
      }
    }

    await db.deleteExperience(id);

    revalidatePath("/admin/experiences");
    revalidatePath("/experiences");
    revalidatePath("/");

    return {
      success: true,
      message: "Experience deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete experience",
    };
  }
}

export async function getCategoriesForDropdown() {
  try {
    const categories = await experienceTypeDb.getAllExperienceTypes();
    return categories.map((cat: any) => ({
      label: cat.title,
      value: cat._id || cat.id,
    }));
  } catch (error) {
    return [];
  }
}
