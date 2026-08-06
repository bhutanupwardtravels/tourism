"use server";

import { revalidatePath } from "next/cache";
import { PaginatedTestimonials, Testimonial } from "./schema";
import * as db from "@/lib/data/testimonials";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/upload";

export async function getTestimonials(
    page: number = 1,
    pageSize: number = 10,
    search?: string
): Promise<PaginatedTestimonials> {
    try {
        const data = await db.listTestimonials(page, pageSize, search);
        return data as PaginatedTestimonials;
    } catch {
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

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
        const testimonial = await db.getTestimonialById(id);
        return testimonial as Testimonial | null;
    } catch {
        return null;
    }
}

export async function createTestimonial(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const getValue = (key: string) => formData.get(key) as string;

        const imageInput = formData.get("avatar");
        let avatarUrl = "";
        if (imageInput instanceof File && imageInput.size > 0) {
            const uploadedPath = await uploadImage(imageInput);
            if (uploadedPath) avatarUrl = uploadedPath;
        }

        const testimonialData = {
            name: getValue("name"),
            role: getValue("role"),
            quote: getValue("quote"),
            avatar: avatarUrl,
            rating: parseFloat(getValue("rating") || "5"),
            isFeatured: getValue("isFeatured") === "true",
            priority: getValue("priority") ? Number(getValue("priority")) : 0,
        };

        await db.createTestimonial(testimonialData);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");

        return { success: true, message: "Testimonial created successfully" };
    } catch {
        return { success: false, message: "Failed to create testimonial" };
    }
}

export async function updateTestimonial(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const getValue = (key: string) => formData.get(key) as string;

        const imageInput = formData.get("avatar");
        const existing = await db.getTestimonialById(id);
        let avatarUrl = existing?.avatar || "";
        if (imageInput instanceof File && imageInput.size > 0) {
            const uploadedPath = await uploadImage(imageInput);
            if (uploadedPath) avatarUrl = uploadedPath;
        }

        const testimonialData = {
            name: getValue("name"),
            role: getValue("role"),
            quote: getValue("quote"),
            avatar: avatarUrl,
            rating: parseFloat(getValue("rating") || "5"),
            isFeatured: getValue("isFeatured") === "true",
            priority: getValue("priority") ? Number(getValue("priority")) : 0,
        };

        await db.updateTestimonial(id, testimonialData);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        revalidatePath(`/admin/testimonials/${id}`);
        revalidatePath(`/admin/testimonials/${id}/edit`);

        return { success: true, message: "Testimonial updated successfully" };
    } catch {
        return { success: false, message: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    try {
        await db.deleteTestimonial(id);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial deleted successfully" };
    } catch {
        return { success: false, message: "Failed to delete testimonial" };
    }
}
