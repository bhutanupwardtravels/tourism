import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange } from "../supabase/mapping";
import { PromoLead } from "@/app/admin/promotions/leads/schema";

const TABLE = "promo_leads";

const COLUMNS = [
    "campaign_id",
    "code",
    "first_name",
    "last_name",
    "email",
    "phone",
    "country",
    "discount_percent",
    "marketing_consent",
    "consent_at",
    "consent_text",
    "source",
    "issued_at",
    "eligible_from",
    "expires_at",
];

export interface LeadFilters {
    campaignId?: string;
    country?: string;
    redeemed?: string;
    /** Issued more than this many months ago and never redeemed — the follow-up list. */
    followUpMonths?: number;
}

export async function listLeads(
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    filters?: LeadFilters
) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) query = query.ilike("email", `%${search}%`);

    const f = filters ?? {};
    if (f.campaignId) query = query.eq("campaign_id", f.campaignId);
    if (f.country) query = query.in("country", f.country.split(","));
    if (f.redeemed === "true") query = query.not("redeemed_at", "is", null);
    if (f.redeemed === "false") query = query.is("redeemed_at", null);

    // "Follow-up due": captured a while back, never converted. This is the whole
    // point of the lead capture — reaching these people months later.
    if (f.followUpMonths && f.followUpMonths > 0) {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - f.followUpMonths);
        query = query.is("redeemed_at", null).lte("issued_at", cutoff.toISOString());
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;

    return {
        items: (data ?? []).map(rowToDoc) as PromoLead[],
        ...paginate(count ?? 0, page, pageSize),
    };
}

/** Unpaginated, for CSV export. Capped so a runaway export can't exhaust memory. */
export async function getLeadsForExport(filters?: LeadFilters, limit = 5000) {
    const { items } = await listLeads(1, limit, undefined, filters);
    return items;
}

export async function createLead(data: Partial<PromoLead>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("*")
        .single();
    if (error) throw error;
    return rowToDoc(inserted) as PromoLead;
}

/** Codes are stored uppercase, so the caller must normalise before lookup. */
export async function findLeadByCode(code: string) {
    const supabase = supabaseAdmin();
    const { data } = await supabase
        .from(TABLE)
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .maybeSingle();
    return data ? (rowToDoc(data) as PromoLead) : null;
}

export async function hasClaimed(campaignId: string, email: string) {
    const supabase = supabaseAdmin();
    const { count, error } = await supabase
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .ilike("email", email.trim());
    if (error) throw error;
    return (count ?? 0) > 0;
}

export async function countIssuedForCampaign(campaignId: string) {
    const supabase = supabaseAdmin();
    const { count, error } = await supabase
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId);
    if (error) throw error;
    return count ?? 0;
}

/**
 * Burn the code. Called when a request is *approved*, not when it's submitted,
 * so a rejected applicant keeps their coupon. Only ever marks an unredeemed
 * row, so a re-approval can't reassign an already-spent code.
 */
export async function markRedeemed(code: string, requestId: string) {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .update({
            redeemed_at: new Date().toISOString(),
            redeemed_request_id: requestId,
            updated_at: new Date().toISOString(),
        })
        .eq("code", code.trim().toUpperCase())
        .is("redeemed_at", null)
        .select("id");
    if (error) throw error;
    return (data ?? []).length > 0;
}
