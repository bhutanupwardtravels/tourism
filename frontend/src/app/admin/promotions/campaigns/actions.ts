"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser as auth } from "@/lib/supabase/server";
import {
    listCampaigns as listCampaignsData,
    getCampaignById as getCampaignByIdData,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} from "@/lib/data/promo-campaigns";
import { ZodError } from "zod";
import { campaignSchema, PromoCampaign } from "./schema";

/** Surface the first validation message; anything else is a generic failure. */
function messageFor(error: unknown, fallback: string) {
    return error instanceof ZodError ? error.issues[0]?.message ?? fallback : fallback;
}

// The banner renders inside the public layout, so every mutation has to bust
// the whole layout cache, not just this admin route.
function revalidateCampaigns() {
    revalidatePath("/admin/promotions/campaigns");
    revalidatePath("/", "layout");
}

export async function listCampaigns(
    page: number,
    pageSize: number,
    search?: string,
    filters?: { isActive?: string }
) {
    try {
        return await listCampaignsData(page, pageSize, search, filters);
    } catch (error) {
        console.error("Failed to list campaigns:", error);
        return { items: [], page: 1, page_size: pageSize, total_pages: 0, has_next: false, has_prev: false, total_items: 0 };
    }
}

export async function getCampaign(id: string) {
    try {
        const campaign = await getCampaignByIdData(id);
        return campaign ? JSON.parse(JSON.stringify(campaign)) : null;
    } catch {
        return null;
    }
}

function parseForm(formData: FormData) {
    const maxIssuedRaw = formData.get("maxIssued") as string;

    return campaignSchema.parse({
        name: formData.get("name"),
        codePrefix: (formData.get("codePrefix") as string ?? "").toUpperCase(),
        discountPercent: Number(formData.get("discountPercent")),
        bannerHeadline: formData.get("bannerHeadline"),
        bannerBody: formData.get("bannerBody") ?? "",
        bannerCtaLabel: formData.get("bannerCtaLabel"),
        // datetime-local gives a local wall-clock string; store it as a real
        // instant so the comparison against now() is unambiguous.
        bannerStartsAt: toIso(formData.get("bannerStartsAt") as string),
        bannerEndsAt: toIso(formData.get("bannerEndsAt") as string),
        couponValidDays: Number(formData.get("couponValidDays")),
        couponEligibleAfterDays: Number(formData.get("couponEligibleAfterDays") || 0),
        maxIssued: maxIssuedRaw ? Number(maxIssuedRaw) : null,
        isActive: formData.get("isActive") === "true",
        priority: Number(formData.get("priority") || 0),
    }) as PromoCampaign;
}

function toIso(value?: string | null) {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export async function createCampaignAction(formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await createCampaign(parseForm(formData));
        revalidateCampaigns();
        return { success: true, message: "Campaign created successfully" };
    } catch (error) {
        console.error("Failed to create campaign:", error);
        return { success: false, message: messageFor(error, "Failed to create campaign") };
    }
}

export async function updateCampaignAction(id: string, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await updateCampaign(id, parseForm(formData));
        revalidateCampaigns();
        revalidatePath(`/admin/promotions/campaigns/${id}/edit`);
        return { success: true, message: "Campaign updated successfully" };
    } catch (error) {
        console.error("Failed to update campaign:", error);
        return { success: false, message: messageFor(error, "Failed to update campaign") };
    }
}

export async function deleteCampaignAction(id: string) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await deleteCampaign(id);
        revalidateCampaigns();
        return { success: true, message: "Campaign deleted successfully" };
    } catch (error) {
        console.error("Failed to delete campaign:", error);
        return { success: false, message: "Failed to delete campaign" };
    }
}
