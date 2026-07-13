import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange } from "../supabase/mapping";
import { ExperienceType } from "@/app/admin/experience-types/schema";

const TABLE = "experience_types";

const COLUMNS = ["slug", "title", "description", "image", "display_order"];

export async function listExperienceTypes(page: number = 1, pageSize: number = 10, search?: string) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        if (search.includes(",")) {
            query = query.in("title", search.split(","));
        } else {
            query = query.ilike("title", `%${search}%`);
        }
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("display_order", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;

    return {
        items: (data ?? []).map(rowToDoc),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export async function getExperienceTypeBySlug(slug: string) {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    return rowToDoc(data);
}

export async function getExperienceTypeById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc(data);
    } catch (error) {
        return null;
    }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getExperienceTypeTitlesByIds(ids: string[]): Promise<Record<string, string>> {
    // Legacy rows may hold slugs/titles instead of uuids; those would make the
    // uuid cast in `.in("id", ...)` throw, so only look up well-formed ids.
    const uuids = ids.filter((id) => UUID_RE.test(id));
    if (uuids.length === 0) return {};
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("id, title").in("id", uuids);
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((row) => [row.id, row.title]));
}

export async function getAllExperienceTypes() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("display_order", { ascending: false })
        .order("title");
    if (error) throw error;
    return (data ?? []).map(rowToDoc);
}

export async function createExperienceType(data: Partial<ExperienceType>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateExperienceType(id: string, data: Partial<ExperienceType>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteExperienceType(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}
