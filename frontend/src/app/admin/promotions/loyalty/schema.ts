import { z } from "zod";
import { LoyaltyTier } from "@/lib/data/promotions";

/**
 * A tier is identified by its threshold: two tiers for the same number of
 * previous trips is meaningless (the resolver takes the max), so
 * `minPriorTrips` doubles as the row key and the edit-route param.
 */
export const loyaltyTierSchema = z.object({
    minPriorTrips: z
        .number({ message: "Enter a number" })
        .int("Use a whole number of trips")
        .min(1, "A tier starts from at least 1 previous trip")
        .max(1000, "That's beyond any realistic trip count"),
    percent: z
        .number({ message: "Enter a number" })
        .min(0, "Cannot be negative")
        .max(100, "Cannot exceed 100%"),
});

export type LoyaltyTierInput = z.infer<typeof loyaltyTierSchema>;

export const loyaltySettingsSchema = z.object({
    loyaltyEnabled: z.boolean(),
    maxPercent: z
        .number({ message: "Enter a number" })
        .min(0, "Cannot be negative")
        .max(100, "Cannot exceed 100%"),
    teaserText: z.string().trim().max(400, "Keep this under 400 characters"),
});

export type LoyaltySettingsInput = z.infer<typeof loyaltySettingsSchema>;

/** A tier as the table shows it: what was configured, and what actually applies. */
export interface LoyaltyTierRow extends LoyaltyTier {
    /** `percent` after the global ceiling is applied — what a traveller really gets. */
    effectivePercent: number;
    /** True when the ceiling is holding this tier back. */
    capped: boolean;
}
