"use server";

import { revalidatePath } from "next/cache";
import { PaginatedExperienceTypes, ExperienceType } from "./schema";
import * as db from "@/lib/data/experience-types";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/upload";

export async function getExperienceTypes(
    page: number = 1,
    pageSize: number = 10,
    search?: string
): Promise<PaginatedExperienceTypes> {
    try {
        const data = await db.listExperienceTypes(page, pageSize, search);
        return data as PaginatedExperienceTypes;
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

export async function getExperienceTypeBySlug(slug: string): Promise<ExperienceType | null> {
    try {
        const experienceType = await db.getExperienceTypeBySlug(slug);
        return experienceType as ExperienceType | null;
    } catch (error) {
        return null;
    }
}

export async function getExperienceTypeById(id: string): Promise<ExperienceType | null> {
    try {
        const experienceType = await db.getExperienceTypeById(id);
        return experienceType as ExperienceType | null;
    } catch (error) {
        return null;
    }
}

export async function createExperienceType(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const displayOrder = parseInt(formData.get("displayOrder") as string || "0");

        const imageInput = formData.get("image");
        let imageUrl = "";

        if (imageInput instanceof File && imageInput.size > 0) {
            const uploadedPath = await uploadImage(imageInput);
            if (uploadedPath) {
                imageUrl = uploadedPath;
            }
        }

        const experienceTypeData: any = {
            title,
            slug,
            description,
            displayOrder,
            image: imageUrl,
        };

        await db.createExperienceType(experienceTypeData);

        revalidatePath("/admin/experience-types");
        revalidatePath("/");

        return {
            success: true,
            message: "Experience type created successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create experience type",
        };
    }
}

export async function updateExperienceType(
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
        const description = formData.get("description") as string;
        const displayOrder = parseInt(formData.get("displayOrder") as string || "0");

        const imageInput = formData.get("image");
        const existingExperienceType = await db.getExperienceTypeById(id);
        let imageUrl = existingExperienceType?.image || "";

        if (imageInput instanceof File && imageInput.size > 0) {
            const uploadedPath = await uploadImage(imageInput);
            if (uploadedPath) {
                imageUrl = uploadedPath;
            }
        }

        const experienceTypeData: any = {
            title,
            slug,
            description,
            displayOrder,
            image: imageUrl,
        };

        await db.updateExperienceType(id, experienceTypeData);

        revalidatePath("/admin/experience-types");
        revalidatePath("/");

        return {
            success: true,
            message: "Experience type updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update experience type",
        };
    }
}

export async function deleteExperienceType(id: string) {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        await db.deleteExperienceType(id);

        revalidatePath("/admin/experience-types");
        revalidatePath("/");

        return {
            success: true,
            message: "Experience type deleted successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete experience type",
        };
    }
}

export async function getCategoriesForDropdown() {
    try {
        const categories = await db.getAllExperienceTypes();
        return categories.map((cat: any) => ({
            label: cat.title,
            value: cat.title,
        }));
    } catch (error) {
        return [];
    }
}
