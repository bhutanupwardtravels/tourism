"use server";

import { revalidatePath } from "next/cache";
import { PaginatedHotels, Hotel } from "./schema";
import * as db from "@/lib/data/hotels";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/upload";

export async function getHotels(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<PaginatedHotels> {
  try {
    const data = await db.listHotels(page, pageSize, search);
    return data as PaginatedHotels;
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

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  try {
    const hotel = await db.getHotelBySlug(slug);
    return hotel as Hotel | null;
  } catch (error) {
    return null;
  }
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    const hotel = await db.getHotelById(id);
    return hotel as Hotel | null;
  } catch (error) {
    return null;
  }
}

export async function getAllHotels() {
  try {
    const hotels = await db.getAllHotels();
    return hotels;
  } catch (error) {
    return [];
  }
}

export async function createHotel(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    const getValue = (key: string) => formData.get(key) as string;

    const priorityStr = getValue("priority");
    const priceStr = getValue("price");

    const latStr = getValue("latitude");
    const lngStr = getValue("longitude");
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const imageInput = formData.get("image");
    let imageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb";

    if (imageInput instanceof File && imageInput.size > 0) {
      const uploadedPath = await uploadImage(imageInput);
      if (uploadedPath) imageUrl = uploadedPath;
    }

    // Process Gallery
    const existingGalleryRaw = formData.get("existingGallery") as string;
    let gallery: string[] = existingGalleryRaw ? JSON.parse(existingGalleryRaw) : [];

    const galleryFiles = formData.getAll("gallery");
    for (const file of galleryFiles) {
      if (file instanceof File && file.size > 0) {
        const uploadedPath = await uploadImage(file);
        if (uploadedPath) {
          gallery.push(uploadedPath);
        }
      }
    }

    const hotelData: any = {
      name: getValue("name"),
      slug: getValue("slug"),
      location: getValue("location"),
      description: getValue("description"),
      destination: getValue("destinationId"), // Store destination ID
      rating: parseFloat(getValue("rating")),
      priceRange: getValue("priceRange"),
      rooms: getValue("rooms") ? parseInt(getValue("rooms")) : undefined,
      amenities: (getValue("amenities") || "").split("\n").filter(a => a.trim()),
      image: imageUrl,
      gallery: gallery,
      priority: priorityStr ? Number(priorityStr) : undefined,
      price: priceStr ? Number(priceStr) : undefined,
    };

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      hotelData.coordinates = [latitude, longitude];
    }

    await db.createHotel(hotelData);
    revalidatePath("/admin/hotels");
    revalidatePath("/hotels");
    revalidatePath("/");

    return { success: true, message: "Hotel created successfully" };
  } catch (error) {
    return { success: false, message: "Failed to create hotel" };
  }
}

export async function updateHotel(id: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    const getValue = (key: string) => formData.get(key) as string;

    const priorityStr = getValue("priority");
    const priceStr = getValue("price");

    const latStr = getValue("latitude");
    const lngStr = getValue("longitude");
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;

    const imageInput = formData.get("image");
    const existingHotel = await db.getHotelById(id);
    let imageUrl = existingHotel?.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb";

    if (imageInput instanceof File && imageInput.size > 0) {
      const uploadedPath = await uploadImage(imageInput);
      if (uploadedPath) imageUrl = uploadedPath;
    }

    // Process Gallery
    const existingGalleryRaw = formData.get("existingGallery") as string;
    let gallery: string[] = existingGalleryRaw ? JSON.parse(existingGalleryRaw) : (existingHotel?.gallery || []);

    const galleryFiles = formData.getAll("gallery");
    for (const file of galleryFiles) {
      if (file instanceof File && file.size > 0) {
        const uploadedPath = await uploadImage(file);
        if (uploadedPath) {
          gallery.push(uploadedPath);
        }
      }
    }

    const hotelData: any = {
      name: getValue("name"),
      slug: getValue("slug"),
      location: getValue("location"),
      description: getValue("description"),
      destination: getValue("destinationId"), // Store destination ID
      rating: parseFloat(getValue("rating")),
      priceRange: getValue("priceRange"),
      rooms: getValue("rooms") ? parseInt(getValue("rooms")) : undefined,
      amenities: (getValue("amenities") || "").split("\n").filter(a => a.trim()),
      image: imageUrl,
      gallery: gallery,
      priority: priorityStr ? Number(priorityStr) : undefined,
      price: priceStr ? Number(priceStr) : undefined,
    };

    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      hotelData.coordinates = [latitude, longitude];
    }

    const hotelId = formData.get("id") as string;
    if (hotelId) {
      await db.updateHotel(hotelId, hotelData);
    } else {
      // Fallback for slug based update if needed, but we still have ID in hidden field or param
      await db.updateHotel(id, hotelData);
    }

    revalidatePath("/admin/hotels");
    revalidatePath("/hotels");
    revalidatePath("/");
    revalidatePath(`/admin/hotels/${id}`);
    revalidatePath(`/admin/hotels/${id}/edit`);

    return { success: true, message: "Hotel updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update hotel" };
  }
}

export async function deleteHotel(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const hotel = await db.getHotelById(id);
    await db.deleteHotel(id);
    revalidatePath("/admin/hotels");
    revalidatePath("/hotels");
    revalidatePath("/");
    if (hotel?.slug) revalidatePath(`/hotels/${hotel.slug}`);
    return { success: true, message: "Hotel deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete hotel" };
  }
}
