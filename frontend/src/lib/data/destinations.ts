import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange } from "../supabase/mapping";
import { Destination } from "@/app/admin/destinations/schema";

const TABLE = "destinations";

const COLUMNS = [
    "slug",
    "name",
    "description",
    "image",
    "region",
    "coordinates",
    "priority",
    "is_entry_point",
];

export async function listDestinations(page: number = 1, pageSize: number = 10, search?: string, region?: string, isEntryPoint?: boolean) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }
    if (region) {
        query = query.in("region", region.split(","));
    }
    if (isEntryPoint !== undefined) {
        query = query.eq("is_entry_point", isEntryPoint);
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("name")
        .range(from, to);
    if (error) throw error;

    return {
        items: (data ?? []).map(rowToDoc),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export async function getAllDestinations() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("priority", { ascending: false })
        .order("name");
    if (error) throw error;
    return (data ?? []).map(rowToDoc);
}

export async function getDestinationBySlug(slug: string) {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    return rowToDoc(data);
}

export async function getDestinationById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc(data);
    } catch (error) {
        return null;
    }
}

export async function createDestination(data: Partial<Destination>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateDestination(id: string, data: Partial<Destination>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteDestination(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function getRegionsForDropdown() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("region");
    if (error) throw error;
    const regions = [...new Set((data ?? []).map((r) => r.region).filter(Boolean))].sort();
    return regions.map((region) => ({ title: region, value: region }));
}

export async function getEntryPointDestinations() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_entry_point", true)
        .order("priority", { ascending: false })
        .order("name");
    if (error) throw error;
    return (data ?? []).map(rowToDoc);
}
