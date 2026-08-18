import { cache } from "react";
import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, rowsToDocs, docToRow, paginate, pageRange } from "../supabase/mapping";
import { Testimonial } from "@/app/admin/testimonials/schema";

const TABLE = "testimonials";

const COLUMNS = ["name", "role", "quote", "avatar", "rating", "is_featured", "priority"];

export async function listTestimonials(page: number = 1, pageSize: number = 10, search?: string) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;

    return {
        items: rowsToDocs<Testimonial>(data),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export const getTestimonialById = cache(async (id: string) => {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return rowToDoc<Testimonial>(data);
    } catch {
        return null;
    }
});

export async function createTestimonial(data: Partial<Testimonial>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteTestimonial(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export const getAllTestimonials = cache(async () => {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").order("priority", { ascending: false });
    if (error) throw error;
    return rowsToDocs<Testimonial>(data);
});

// Featured testimonials by priority (homepage section).
export const getFeaturedTestimonials = cache(async (limit: number = 6) => {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_featured", true)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) throw error;
    return rowsToDocs<Testimonial>(data);
});
