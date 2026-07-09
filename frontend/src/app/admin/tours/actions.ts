"use server";

import * as tourDb from "@/lib/data/tours";
import { Tour, PaginatedTours } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";
import { getAdminUser as auth } from "@/lib/supabase/server";
import * as experienceDb from "@/lib/data/experiences";
import * as hotelDb from "@/lib/data/hotels";
import * as destinationDb from "@/lib/data/destinations";
import * as experienceTypeDb from "@/lib/data/experience-types";

export async function getTours(page: number = 1, pageSize: number = 10, category?: string | string[], search?: string): Promise<PaginatedTours> {
    try {
        const data = await tourDb.listTours(page, pageSize, category, search);
        return data as PaginatedTours;
    } catch (error) {
        return {
            items: [],
            page,
            page_size: pageSize,
            total_pages: 0,
            has_next: false,
            has_prev: false,
        };
    }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
    try {
        const tour = await tourDb.getTourBySlug(slug);
        return tour as Tour | null;
    } catch (error) {
        return null;
    }
}

export async function getRelatedTours(slug: string): Promise<Tour[]> {
    try {
        const tours = await tourDb.getRelatedTours(slug);
        return tours as Tour[];
    } catch (error) {
        return [];
    }
}


export async function getTourById(id: string): Promise<Tour | null> {
    try {
        const tour = await tourDb.getTourById(id);
        return tour as Tour | null;
    } catch (error) {
        return null;
    }
}

export async function createTourAction(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const duration = formData.get("duration") as string;
        const price = parseFloat(formData.get("price") as string || "0");
        const priority = parseInt(formData.get("priority") as string || "0");
        const highlightsStr = formData.get("highlights") as string;
        const highlights = JSON.parse(highlightsStr || "[]");

        const daysStr = formData.get("days") as string;
        let days = JSON.parse(daysStr || "[]");

        let imageUrl = formData.get("image") as string;
        const imageFile = formData.get("imageFile") as File;

        if (imageFile && imageFile.size > 0) {
            const uploadedPath = await uploadImage(imageFile);
            if (uploadedPath) imageUrl = uploadedPath;
        }

        // Handle day images
        for (let i = 0; i < days.length; i++) {
            const dayImageFile = formData.get(`dayImage_${i}`) as File;
            if (dayImageFile && dayImageFile.size > 0) {
                const uploadedPath = await uploadImage(dayImageFile);
                if (uploadedPath) {
                    days[i].image = uploadedPath;
                }
            }
        }

        const selectedCostIdsStr = formData.get("selectedCostIds") as string;
        const selectedCostIds = JSON.parse(selectedCostIdsStr || "[]");

        const tourData: Partial<Tour> = {
            title,
            slug,
            category,
            description,
            duration,
            price,
            priority,
            highlights,
            days,
            selectedCostIds,
            image: imageUrl,
        };

        const id = await tourDb.createTour(tourData);
        revalidatePath("/admin/tours");
        revalidatePath("/tours");
        return { success: true, message: "Tour created successfully", id: String(id) };
    } catch (error) {
        return { success: false, message: "Failed to create tour" };
    }
}

export async function updateTourAction(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const duration = formData.get("duration") as string;
        const price = parseFloat(formData.get("price") as string || "0");
        const priority = parseInt(formData.get("priority") as string || "0");
        const highlightsStr = formData.get("highlights") as string;
        const highlights = JSON.parse(highlightsStr || "[]");

        const daysStr = formData.get("days") as string;
        let days = JSON.parse(daysStr || "[]");

        let imageUrl = formData.get("image") as string;
        const imageFile = formData.get("imageFile") as File;

        if (imageFile && imageFile.size > 0) {
            const uploadedPath = await uploadImage(imageFile);
            if (uploadedPath) imageUrl = uploadedPath;
        }

        // Handle day images
        for (let i = 0; i < days.length; i++) {
            const dayImageFile = formData.get(`dayImage_${i}`) as File;
            if (dayImageFile && dayImageFile.size > 0) {
                const uploadedPath = await uploadImage(dayImageFile);
                if (uploadedPath) {
                    days[i].image = uploadedPath;
                }
            }
        }

        const selectedCostIdsStr = formData.get("selectedCostIds") as string;
        const selectedCostIds = JSON.parse(selectedCostIdsStr || "[]");

        const tourData: Partial<Tour> = {
            title,
            slug,
            category,
            description,
            duration,
            price,
            priority,
            highlights,
            days,
            selectedCostIds,
            image: imageUrl,
        };

        await tourDb.updateTour(id, tourData);
        revalidatePath("/admin/tours");
        revalidatePath(`/admin/tours/${id}`);
        revalidatePath(`/admin/tours/${id}/edit`);
        revalidatePath("/tours");
        revalidatePath(`/tours/${slug}`);
        return { success: true, message: "Tour updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update tour" };
    }
}

export async function deleteTourAction(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    try {
        await tourDb.deleteTour(id);
        revalidatePath("/admin/tours");
        revalidatePath("/tours");
        return { success: true, message: "Tour deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed to delete tour" };
    }
}

export async function getCategoriesForDropdown(): Promise<{ value: string; label: string }[]> {
    try {
        const categories = await experienceTypeDb.getAllExperienceTypes();
        return categories.map((cat: any) => ({
            value: cat._id || cat.id || cat.title,
            label: cat.title,
        }));
    } catch (error) {
        return [];
    }
}

export async function getExperiencesForDropdown(): Promise<{ value: string; label: string; price?: number; duration?: string; image?: string; destinationIds?: string[]; destinationSlug?: string }[]> {
    try {
        const experiences = await experienceDb.getAllExperiences();
        return experiences.map((exp: any) => ({
            value: exp._id,
            label: exp.title,
            price: exp.price != null ? Number(exp.price) : 0,
            duration: exp.duration || "2 Hours",
            image: exp.image || "",
            // resolved IDs from pipeline, fallback to raw array
            destinationIds: exp.destinationIds || exp.destinations || [],
            destinationSlug: exp.destinationSlug || (exp.resolvedDestinations?.[0] ?? ""),
        }));
    } catch (error) {
        return [];
    }
}

export async function getHotelsForDropdown(): Promise<{ value: string; label: string; price?: number; image?: string; destinationId?: string; destinationSlug?: string }[]> {
    try {
        const hotels = await hotelDb.getAllHotels();
        return hotels.map((hotel: any) => ({
            value: hotel._id,
            label: hotel.name,
            price: hotel.price != null ? Number(hotel.price) : 0,
            image: hotel.image || "",
            // resolved by pipeline
            destinationId: hotel.destinationId || hotel.destination || "",
            destinationSlug: hotel.resolvedDestinationSlug || hotel.destinationSlug || "",
        }));
    } catch (error) {
        return [];
    }
}

export async function getDestinationsForDropdown(): Promise<{ value: string; label: string }[]> {
    try {
        const destinations = await destinationDb.getAllDestinations();
        return destinations.map((dest: any) => ({
            value: dest._id,
            label: dest.name,
        }));
    } catch (error) {
        return [];
    }
}

export async function getAllDestinationObjects(): Promise<{ _id: string; name: string; image?: string; slug?: string }[]> {
    try {
        const destinations = await destinationDb.getAllDestinations();
        return destinations.map((dest: any) => ({
            _id: dest._id,
            name: dest.name,
            image: dest.image || "",
            slug: dest.slug || "",
        }));
    } catch (error) {
        return [];
    }
}

export async function getEntryPointDestinationObjects(): Promise<{ _id: string; name: string; image?: string; slug?: string }[]> {
    try {
        const destinations = await destinationDb.getEntryPointDestinations();
        return destinations.map((dest: any) => ({
            _id: dest._id,
            name: dest.name,
            image: dest.image || "",
            slug: dest.slug || "",
        }));
    } catch (error) {
        return [];
    }
}
