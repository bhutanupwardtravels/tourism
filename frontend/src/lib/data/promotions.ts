import { supabaseAdmin } from "../supabase/admin";

const TABLE = "site_promotions";

/**
 * A loyalty tier is a *threshold*, not an exact trip count: the highest tier
 * whose `minPriorTrips` is satisfied wins. So "4% from the 3rd trip onward"
 * needs one entry rather than one per count.
 */
export interface LoyaltyTier {
    minPriorTrips: number;
    percent: number;
}

export interface PromoSettings {
    loyaltyEnabled: boolean;
    tiers: LoyaltyTier[];
    /** Hard ceiling on any single discount, whatever the tiers or coupon say. */
    maxPercent: number;
    /** Which tour_request statuses count as a "previous trip". */
    qualifyingStatuses: string[];
    /** Only "best_of" is implemented; the field exists so the rule is visible and changeable. */
    stacking: "best_of";
    teaserText: string;
    updatedAt?: string;
}

function defaultPromoSettings(): PromoSettings {
    return {
        loyaltyEnabled: false,
        tiers: [],
        maxPercent: 15,
        qualifyingStatuses: ["approved"],
        stacking: "best_of",
        teaserText:
            "Travelled with us before? Apply using the same email address to unlock your returning-traveller discount.",
    };
}

export async function getPromoSettings(): Promise<PromoSettings> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase
        .from(TABLE)
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();

    const defaults = defaultPromoSettings();
    if (!row) return defaults;

    const doc = row.content as Partial<PromoSettings>;
    return {
        ...defaults,
        ...doc,
        tiers: Array.isArray(doc.tiers) ? doc.tiers : defaults.tiers,
        qualifyingStatuses:
            Array.isArray(doc.qualifyingStatuses) && doc.qualifyingStatuses.length > 0
                ? doc.qualifyingStatuses
                : defaults.qualifyingStatuses,
        updatedAt: row.updated_at,
    };
}

export async function updatePromoSettings(data: PromoSettings) {
    const supabase = supabaseAdmin();
    const { updatedAt: _updatedAt, ...content } = data;

    const { error } = await supabase.from(TABLE).upsert({
        id: 1,
        content,
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return { acknowledged: true };
}
