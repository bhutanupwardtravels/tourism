import { supabaseAdmin } from "../supabase/admin";
import { PromoSettings } from "./promotions";

/**
 * How many prior qualifying trips this email has. Matches on the generated
 * `email_lower` column (indexed) rather than `ilike`, because people rarely
 * type their address with consistent casing across bookings.
 *
 * `excludeRequestId` lets a request exclude itself when the count is recomputed
 * after the row already exists.
 */
export async function countPriorTrips(
    email: string,
    qualifyingStatuses: string[],
    excludeRequestId?: string
): Promise<number> {
    const normalised = (email || "").trim().toLowerCase();
    if (!normalised || qualifyingStatuses.length === 0) return 0;

    const supabase = supabaseAdmin();
    let query = supabase
        .from("tour_requests")
        .select("id", { count: "exact", head: true })
        .eq("email_lower", normalised)
        .in("status", qualifyingStatuses);

    if (excludeRequestId) query = query.neq("id", excludeRequestId);

    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
}

/**
 * The highest tier the traveller has earned, clamped to the configured ceiling.
 * Returns 0 when loyalty is off, no tier is met, or the config is empty.
 */
export function resolveLoyaltyTier(priorTrips: number, settings: PromoSettings): number {
    if (!settings.loyaltyEnabled || priorTrips <= 0) return 0;

    const earned = (settings.tiers || [])
        .filter((tier) => Number.isFinite(tier?.percent) && priorTrips >= (tier?.minPriorTrips ?? 0))
        .reduce((best, tier) => Math.max(best, tier.percent), 0);

    return Math.max(0, Math.min(earned, settings.maxPercent ?? 100));
}
