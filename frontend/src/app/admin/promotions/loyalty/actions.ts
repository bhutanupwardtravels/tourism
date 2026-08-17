"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { getPromoSettings, updatePromoSettings, PromoSettings } from "@/lib/data/promotions";

export async function getPromoSettingsAction(): Promise<PromoSettings> {
    try {
        // Force plain objects across the RSC boundary.
        return JSON.parse(JSON.stringify(await getPromoSettings()));
    } catch {
        throw new Error("Failed to fetch promotion settings");
    }
}

export async function updatePromoSettingsAction(data: PromoSettings) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        // Normalise before storing: drop blank rows, clamp, and keep tiers in
        // ascending order so the admin table and the resolver agree on reading
        // order (resolveLoyaltyTier takes the max, so this is cosmetic — but a
        // jumbled list is genuinely hard to reason about).
        const tiers = (data.tiers || [])
            .filter((t) => Number.isFinite(t.minPriorTrips) && Number.isFinite(t.percent))
            .map((t) => ({
                minPriorTrips: Math.max(1, Math.round(t.minPriorTrips)),
                percent: Math.max(0, Math.min(t.percent, data.maxPercent ?? 100)),
            }))
            .sort((a, b) => a.minPriorTrips - b.minPriorTrips);

        await updatePromoSettings({ ...data, tiers, stacking: "best_of" });
        revalidatePath("/admin/promotions/loyalty");
        return { success: true, message: "Loyalty settings updated successfully" };
    } catch (error) {
        console.error("Failed to update promo settings:", error);
        return { success: false, message: "Failed to update loyalty settings" };
    }
}
