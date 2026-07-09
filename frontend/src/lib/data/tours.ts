import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange } from "../supabase/mapping";

const TABLE = "tours";

const COLUMNS = [
    "slug",
    "title",
    "description",
    "image",
    "duration",
    "price",
    "priority",
    "category",
    "highlights",
    "days",
    "selected_cost_ids",
];

export async function listTours(page: number = 1, pageSize: number = 10, category?: string | string[], search?: string) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (category) {
        query = Array.isArray(category)
            ? query.in("category", category)
            : query.eq("category", category);
    }
    if (search) {
        query = query.ilike("title", `%${search}%`);
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("title")
        .range(from, to);
    if (error) throw error;

    return {
        items: (data ?? []).map(rowToDoc),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export async function getTourBySlug(slug: string) {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    return rowToDoc(data);
}

export async function getTourById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc(data);
    } catch (error) {
        return null;
    }
}

export async function getAllTours() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("priority", { ascending: false })
        .order("title");
    if (error) throw error;
    return (data ?? []).map(rowToDoc);
}

export async function getRelatedTours(slug: string, limit: number = 3) {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .neq("slug", slug)
        .limit(limit);
    if (error) throw error;
    return (data ?? []).map(rowToDoc);
}

export async function createTour(data: any) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateTour(id: string, data: any) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteTour(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function listCategories() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("category");
    if (error) throw error;
    const categories = [...new Set((data ?? []).map((r) => r.category).filter(Boolean))].sort();
    return categories.map((cat) => ({ id: cat, name: cat }));
}
