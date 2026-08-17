"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { getAdminUser as auth } from "@/lib/supabase/server";
import { getPromoSettings, updatePromoSettings, PromoSettings, LoyaltyTier } from "@/lib/data/promotions";
import { loyaltySettingsSchema, loyaltyTierSchema } from "./schema";

/** Surface the first validation message; anything else is a generic failure. */
function messageFor(error: unknown, fallback: string) {
    return error instanceof ZodError ? error.issues[0]?.message ?? fallback : fallback;
}

/**
 * Keep tiers ascending. The resolver takes the max so order is cosmetic, but a
 * jumbled list is genuinely hard to reason about in the table.
 */
function sortTiers(tiers: LoyaltyTier[]) {
    return [...tiers].sort((a, b) => a.minPriorTrips - b.minPriorTrips);
}

function revalidateLoyalty() {
    revalidatePath("/admin/promotions/loyalty");
}

export async function getPromoSettingsAction(): Promise<PromoSettings> {
    try {
        // Force plain objects across the RSC boundary.
        return JSON.parse(JSON.stringify(await getPromoSettings()));
    } catch {
        throw new Error("Failed to fetch promotion settings");
    }
}

/** One tier, looked up by its threshold — the key the edit route carries. */
export async function getTierAction(minPriorTrips: number): Promise<LoyaltyTier | null> {
    try {
        const settings = await getPromoSettings();
        const tier = settings.tiers.find((t) => t.minPriorTrips === minPriorTrips);
        return tier ? { ...tier } : null;
    } catch {
        return null;
    }
}

function parseTierForm(formData: FormData) {
    return loyaltyTierSchema.parse({
        minPriorTrips: Number(formData.get("minPriorTrips")),
        percent: Number(formData.get("percent")),
    });
}

export async function createTierAction(formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const tier = parseTierForm(formData);
        const settings = await getPromoSettings();

        if (settings.tiers.some((t) => t.minPriorTrips === tier.minPriorTrips)) {
            return {
                success: false,
                message: `A tier for ${tier.minPriorTrips} previous trip(s) already exists.`,
            };
        }

        await updatePromoSettings({ ...settings, tiers: sortTiers([...settings.tiers, tier]) });
        revalidateLoyalty();
        return { success: true, message: "Tier added successfully" };
    } catch (error) {
        console.error("Failed to create loyalty tier:", error);
        return { success: false, message: messageFor(error, "Failed to add tier") };
    }
}

/**
 * `originalMinPriorTrips` is the tier being replaced, which is not necessarily
 * the one being saved — editing the threshold moves the row's identity.
 */
export async function updateTierAction(originalMinPriorTrips: number, formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const tier = parseTierForm(formData);
        const settings = await getPromoSettings();

        if (!settings.tiers.some((t) => t.minPriorTrips === originalMinPriorTrips)) {
            return { success: false, message: "That tier no longer exists" };
        }

        const collides =
            tier.minPriorTrips !== originalMinPriorTrips &&
            settings.tiers.some((t) => t.minPriorTrips === tier.minPriorTrips);

        if (collides) {
            return {
                success: false,
                message: `A tier for ${tier.minPriorTrips} previous trip(s) already exists.`,
            };
        }

        const tiers = settings.tiers.map((t) =>
            t.minPriorTrips === originalMinPriorTrips ? tier : t
        );

        await updatePromoSettings({ ...settings, tiers: sortTiers(tiers) });
        revalidateLoyalty();
        return { success: true, message: "Tier updated successfully" };
    } catch (error) {
        console.error("Failed to update loyalty tier:", error);
        return { success: false, message: messageFor(error, "Failed to update tier") };
    }
}

export async function deleteTierAction(minPriorTrips: number) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const settings = await getPromoSettings();
        const tiers = settings.tiers.filter((t) => t.minPriorTrips !== minPriorTrips);

        if (tiers.length === settings.tiers.length) {
            return { success: false, message: "That tier no longer exists" };
        }

        await updatePromoSettings({ ...settings, tiers });
        revalidateLoyalty();
        return { success: true, message: "Tier deleted successfully" };
    } catch (error) {
        console.error("Failed to delete loyalty tier:", error);
        return { success: false, message: "Failed to delete tier" };
    }
}

/** The three global settings. Tiers are edited row by row and pass through untouched. */
export async function updateLoyaltySettingsAction(formData: FormData) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const parsed = loyaltySettingsSchema.parse({
            loyaltyEnabled: formData.get("loyaltyEnabled") === "true",
            maxPercent: Number(formData.get("maxPercent")),
            teaserText: formData.get("teaserText") ?? "",
        });

        const settings = await getPromoSettings();
        await updatePromoSettings({ ...settings, ...parsed, stacking: "best_of" });
        revalidateLoyalty();
        return { success: true, message: "Loyalty settings updated successfully" };
    } catch (error) {
        console.error("Failed to update promo settings:", error);
        return { success: false, message: messageFor(error, "Failed to update loyalty settings") };
    }
}
