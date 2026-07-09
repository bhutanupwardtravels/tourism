
"use server";

import { revalidatePath } from "next/cache";
import { createCost, updateCost, deleteCost, listCosts as listCostsData } from "@/lib/data/settings";
import { costSchema } from "./schema";

export async function listCosts(page: number, pageSize: number, search?: string, filters?: any) {
    return await listCostsData(page, pageSize, search, filters);
}

export async function createCostAction(formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            type: formData.get("type"),
            isIndianNational: formData.get("isIndianNational") === "true",
            travelerCategory: formData.get("travelerCategory"),
        };

        const validatedData = costSchema.parse(rawData);
        await createCost(validatedData);
        revalidatePath("/admin/settings");
        return { success: true, message: "Cost created successfully" };
    } catch (error) {
        return { success: false, message: "Failed to create cost" };
    }
}

export async function updateCostAction(id: string, formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            type: formData.get("type"),
            isIndianNational: formData.get("isIndianNational") === "true",
            travelerCategory: formData.get("travelerCategory"),
        };

        const validatedData = costSchema.parse(rawData);
        await updateCost(id, validatedData);
        revalidatePath("/admin/settings");
        return { success: true, message: "Cost updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update cost" };
    }
}

export async function deleteCostAction(id: string) {
    try {
        await deleteCost(id);
        revalidatePath("/admin/settings");
        return { success: true, message: "Cost deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed to delete cost" };
    }
}
