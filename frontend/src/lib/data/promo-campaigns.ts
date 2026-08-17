import { cache } from "react";
import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange } from "../supabase/mapping";
import { PromoCampaign } from "@/app/admin/promotions/campaigns/schema";

const TABLE = "promo_campaigns";

const COLUMNS = [
    "name",
    "code_prefix",
    "discount_percent",
    "banner_headline",
    "banner_body",
    "banner_cta_label",
    "banner_starts_at",
    "banner_ends_at",
    "coupon_valid_days",
    "coupon_eligible_after_days",
    "max_issued",
    "is_active",
    "priority",
];

export async function listCampaigns(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    filters?: { isActive?: string }
) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) query = query.ilike("name", `%${search}%`);
    if (filters?.isActive) query = query.eq("is_active", filters.isActive === "true");

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;

    return {
        items: (data ?? []).map(rowToDoc) as PromoCampaign[],
        ...paginate(count ?? 0, page, pageSize),
    };
}

export const getCampaignById = cache(async (id: string) => {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc(data) as PromoCampaign | null;
    } catch {
        return null;
    }
});

/**
 * The campaign whose banner should be on screen right now.
 *
 * The window is checked here so an inactive or long-finished campaign is never
 * shipped to the browser, but the *client* re-checks it against the real clock:
 * the public layout is ISR'd with revalidate = 3600, so a purely server-side
 * check could keep a just-expired banner up for an hour.
 */
export const getActiveBannerCampaign = cache(async (): Promise<PromoCampaign | null> => {
    try {
        const supabase = supabaseAdmin();
        const now = new Date().toISOString();

        const { data } = await supabase
            .from(TABLE)
            .select("*")
            .eq("is_active", true)
            .or(`banner_starts_at.is.null,banner_starts_at.lte.${now}`)
            .or(`banner_ends_at.is.null,banner_ends_at.gte.${now}`)
            .order("priority", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        return rowToDoc(data) as PromoCampaign | null;
    } catch {
        // The banner is never worth breaking the site layout over.
        return null;
    }
});

export async function createCampaign(data: Partial<PromoCampaign>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateCampaign(id: string, data: Partial<PromoCampaign>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteCampaign(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

/** For the faceted filter on the leads table. */
export async function getCampaignsForDropdown() {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("id, name").order("created_at", { ascending: false });
    return (data ?? []).map((c) => ({ title: c.name as string, value: c.id as string }));
}
