import { cache } from "react";
import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange, UUID_RE } from "../supabase/mapping";
import { Experience } from "@/app/admin/experiences/schema";

const TABLE = "experiences";

const COLUMNS = [
    "slug",
    "title",
    "category",
    "description",
    "image",
    "duration",
    "difficulty",
    "coordinates",
    "destination_slug",
    "destinations",
    "gallery",
    "start_date",
    "end_date",
    "priority",
    "price",
];

// Legacy data stores `category` as either an experience_types id or a plain
// title, and `destinations` as an array of destination ids or slugs. This
// mirrors the old Mongo $lookup pipeline: resolve ids to titles/slugs and
// expose categoryId / resolvedDestinations / destinationIds alongside.
// The two lookup tables are read once per request and shared across every
// resolveRefs() call (list + carousels) via cache().
const loadRefMaps = cache(async () => {
    const supabase = supabaseAdmin();
    const [{ data: types }, { data: dests }] = await Promise.all([
        supabase.from("experience_types").select("id, title"),
        supabase.from("destinations").select("id, slug"),
    ]);
    return {
        typeById: new Map((types ?? []).map((t) => [t.id, t.title])),
        destById: new Map((dests ?? []).map((d) => [d.id, d.slug])),
    };
});

async function resolveRefs(docs: any[]): Promise<any[]> {
    if (docs.length === 0) return docs;

    const { typeById, destById } = await loadRefMaps();

    return docs.map((doc) => {
        const resolved = { ...doc };

        if (doc.category && UUID_RE.test(doc.category) && typeById.has(doc.category)) {
            resolved.categoryId = doc.category;
            resolved.category = typeById.get(doc.category);
        } else {
            resolved.categoryId = doc.category;
        }

        const destinations: string[] = Array.isArray(doc.destinations) ? doc.destinations : [];
        resolved.resolvedDestinations = destinations.map((d) =>
            UUID_RE.test(d) && destById.has(d) ? destById.get(d) : d
        );
        resolved.destinationIds = destinations;

        return resolved;
    });
}

export async function listExperiences(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    category?: string
) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        query = query.ilike("title", `%${search}%`);
    }
    if (category) {
        query = query.in("category", category.split(","));
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;

    return {
        items: await resolveRefs((data ?? []).map(rowToDoc)),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export const getExperienceBySlug = cache(async (slug: string) => {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    if (!data) return null;
    const [resolved] = await resolveRefs([rowToDoc(data)]);
    return resolved;
});

export const getExperienceById = cache(async (id: string) => {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        if (!data) return null;
        const [resolved] = await resolveRefs([rowToDoc(data)]);
        return resolved;
    } catch (error) {
        return null;
    }
});

export const getAllExperiences = cache(async () => {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").order("title");
    if (error) throw error;
    return resolveRefs((data ?? []).map(rowToDoc));
});

export async function createExperience(data: Partial<Experience>) {
    const supabase = supabaseAdmin();
    try {
        const { data: inserted, error } = await supabase
            .from(TABLE)
            .insert(docToRow(data, COLUMNS))
            .select("id")
            .single();
        if (error) throw error;
        return inserted.id;
    } catch (error) {
        return null;
    }
}

export async function updateExperience(id: string, data: Partial<Experience>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteExperience(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function getCategoriesForDropdown() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("category");
    if (error) throw error;
    const categories = [...new Set((data ?? []).map((r) => r.category).filter(Boolean))].sort();
    return categories.map((cat) => ({ title: cat, value: cat }));
}

export async function getExperiencesByDestination(destinationId?: string, slug?: string) {
    if (!destinationId && !slug) return [];

    const supabase = supabaseAdmin();

    // Filter in Postgres: match the destination_slug column, or the jsonb
    // `destinations` array (holds ids or slugs) via containment. A few indexed
    // queries beat pulling the whole table and filtering in JS.
    const byId = new Map<string, any>();
    const collect = (rows: any[] | null) => (rows ?? []).forEach((r) => byId.set(r.id, r));

    if (slug) {
        const { data, error } = await supabase.from(TABLE).select("*").eq("destination_slug", slug);
        if (error) throw error;
        collect(data);
    }

    for (const ref of [destinationId, slug].filter(Boolean) as string[]) {
        const { data, error } = await supabase.from(TABLE).select("*").contains("destinations", [ref]);
        if (error) throw error;
        collect(data);
    }

    return resolveRefs([...byId.values()].map(rowToDoc));
}
