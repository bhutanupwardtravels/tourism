"use server";

import { revalidatePath } from "next/cache";
import { PaginatedDestinations, Destination } from "./schema";
import * as db from "@/lib/data/destinations";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/upload";

export async function getDestinations(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  region?: string,
  isEntryPoint?: boolean
): Promise<PaginatedDestinations> {
  try {
    const data = await db.listDestinations(page, pageSize, search, region, isEntryPoint);
    return data as PaginatedDestinations;
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

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const destination = await db.getDestinationBySlug(slug);
    return destination as Destination | null;
  } catch (error) {
    return null;
  }
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  try {
    const destination = await db.getDestinationById(id);
    return destination as Destination | null;
  } catch (error) {
    return null;
  }
}

export async function getAllDestinations() {
  try {
    const destinations = await db.getAllDestinations();
    return destinations;
  } catch (error) {
    return [];
  }
}

export async function createDestination(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const region = formData.get("region") as string;
    const description = formData.get("description") as string;
    const priority = parseInt(formData.get("priority") as string) || 0;
    const isEntryPoint = formData.get("isEntryPoint") === "on" || formData.get("isEntryPoint") === "true";

    const latStr = formData.get("latitude") as string;
    const lngStr = formData.get("longitude") as string;
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const imageInput = formData.get("image");
    let imageUrl = "https://images.unsplash.com/photo-1578500263628-936ddec022cf";

    if (imageInput instanceof File && imageInput.size > 0) {
      const uploadedPath = await uploadImage(imageInput);
      if (uploadedPath) {
        imageUrl = uploadedPath;
      }
    }

    const destinationData: any = {
      name,
      slug,
      region,
      description,
      priority,
      isEntryPoint,
      image: imageUrl,
    };

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      destinationData.coordinates = [latitude, longitude];
    }

    await db.createDestination(destinationData);

    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    revalidatePath("/");

    return {
      success: true,
      message: "Destination created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create destination",
    };
  }
}

export async function updateDestination(
  id: string,
  prevState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const region = formData.get("region") as string;
    const description = formData.get("description") as string;
    const priority = parseInt(formData.get("priority") as string) || 0;
    const isEntryPoint = formData.get("isEntryPoint") === "on" || formData.get("isEntryPoint") === "true";

    const latStr = formData.get("latitude") as string;
    const lngStr = formData.get("longitude") as string;
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const imageInput = formData.get("image");
    const existingDestination = await db.getDestinationById(id);
    let imageUrl = existingDestination?.image || "https://images.unsplash.com/photo-1578500263628-936ddec022cf";

    if (imageInput instanceof File && imageInput.size > 0) {
      const uploadedPath = await uploadImage(imageInput);
      if (uploadedPath) {
        imageUrl = uploadedPath;
      }
    }

    const destinationData: any = {
      name,
      slug,
      region,
      description,
      priority,
      isEntryPoint,
      image: imageUrl,
    };

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      destinationData.coordinates = [latitude, longitude];
    }

    await db.updateDestination(id, destinationData);

    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    revalidatePath("/");
    revalidatePath(`/admin/destinations/${id}/edit`);

    return {
      success: true,
      message: "Destination updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update destination",
    };
  }
}

export async function deleteDestination(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const destination = await db.getDestinationById(id);
    await db.deleteDestination(id);
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    revalidatePath("/");
    if (destination?.slug) revalidatePath(`/destinations/${destination.slug}`);

    return {
      success: true,
      message: "Destination deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete destination",
    };
  }
}

export async function getRegionsForDropdown() {
  return db.getRegionsForDropdown();
}
