import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, rowsToDocs, docToRow, paginate, pageRange } from "../supabase/mapping";
import { Cost } from "@/app/admin/settings/schema";

const TABLE = "global_costs";

const COLUMNS = [
    "title",
    "description",
    "price",
    "type",
    "applies_to",
    "charge_basis",
    "traveler_category",
];

/** Optional column filters the cost table exposes, as they arrive from the URL. */
export type CostFilters = {
    travelerCategory?: Cost["travelerCategory"];
    /** A string because it comes straight off a query parameter. */
    appliesTo?: string;
};

export async function listCosts(page: number = 1, pageSize: number = 10, search?: string, filters?: CostFilters) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        query = query.ilike("title", `%${search}%`);
    }

    const f = filters || {};
    if (f.travelerCategory) {
        query = query.eq("traveler_category", f.travelerCategory);
    }
    if (f.appliesTo) {
        query = query.eq("applies_to", f.appliesTo);
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query.order("title").range(from, to);
    if (error) throw error;

    return {
        items: rowsToDocs<Cost>(data),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export async function getAllCosts() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").order("title");
    if (error) throw error;
    return rowsToDocs<Cost>(data);
}

export async function getCostById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc<Cost>(data);
    } catch {
        return null;
    }
}

export async function createCost(data: Partial<Cost>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateCost(id: string, data: Partial<Cost>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteCost(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}
