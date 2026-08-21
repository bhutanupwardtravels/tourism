import { cache } from "react";
import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, rowsToDocs, docToRow, paginate, pageRange, UUID_RE } from "../supabase/mapping";
import { Hotel } from "@/app/admin/hotels/schema";

const TABLE = "hotels";

const COLUMNS = [
    "name",
    "slug",
    "location",
    "description",
    "image",
    "destination",
    "destination_slug",
    "destination_id",
    "rating",
    "amenities",
    "price_range",
    "rooms",
    "coordinates",
    "gallery",
    "priority",
    "price",
];

// Legacy data references a destination through any of `destination`,
// `destinationId` or `destinationSlug` (id or slug). This mirrors the old
// Mongo $lookup: resolve whichever is present and expose
// resolvedDestinationName / resolvedDestinationSlug / destinationId.
// The destinations lookup table is read once per request and shared across
// every resolveDestinations() call (list + carousels) via cache().
const loadDestinationIndex = cache(async () => {
    const supabase = supabaseAdmin();
    const { data: dests } = await supabase.from("destinations").select("id, name, slug");
    return {
        byId: new Map((dests ?? []).map((d) => [d.id, d])),
        bySlug: new Map((dests ?? []).map((d) => [d.slug, d])),
    };
});

async function resolveDestinations(docs: Hotel[]): Promise<Hotel[]> {
    if (docs.length === 0) return docs;

    const { byId, bySlug } = await loadDestinationIndex();

    return docs.map((doc) => {
        const ref = doc.destination || doc.destinationId || doc.destinationSlug;
        const match =
            (ref && UUID_RE.test(ref) ? byId.get(ref) : undefined) ??
            (ref ? bySlug.get(ref) : undefined);

        return {
            ...doc,
            resolvedDestinationName: match ? match.name : doc.destinationSlug,
            resolvedDestinationSlug: match ? match.slug : doc.destinationSlug,
            destinationId: match ? match.id : doc.destinationId,
        };
    });
}

export async function listHotels(page: number = 1, pageSize: number = 10, search?: string) {
    const supabase = supabaseAdmin();

    let query = supabase.from(TABLE).select("*", { count: "exact" });
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const [from, to] = pageRange(page, pageSize);
    const { data, count, error } = await query
        .order("priority", { ascending: false })
        .order("name")
        .range(from, to);
    if (error) throw error;

    return {
        items: await resolveDestinations(rowsToDocs<Hotel>(data)),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export const getHotelById = cache(async (id: string) => {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        if (!data) return null;
        const [resolved] = await resolveDestinations([rowToDoc<Hotel>(data) as Hotel]);
        return resolved;
    } catch {
        return null;
    }
});

export const getHotelBySlug = cache(async (slug: string) => {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    if (!data) return null;
    const [resolved] = await resolveDestinations([rowToDoc<Hotel>(data) as Hotel]);
    return resolved;
});

export async function createHotel(data: Partial<Hotel>) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateHotel(id: string, data: Partial<Hotel>) {
    const supabase = supabaseAdmin();
    const { error } = await supabase
        .from(TABLE)
        .update({ ...docToRow(data, COLUMNS), updated_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteHotel(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { acknowledged: true };
}

export const getAllHotels = cache(async () => {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").order("name");
    if (error) throw error;
    return resolveDestinations(rowsToDocs<Hotel>(data));
});

// Top-N by priority in Postgres (homepage best hotels).
export async function getTopHotels(limit: number = 6) {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("priority", { ascending: false })
        .order("name")
        .limit(limit);
    if (error) throw error;
    return resolveDestinations(rowsToDocs<Hotel>(data));
}

/**
 * Hotels attached to any of the given destination references. A reference is
 * whatever the caller happens to hold — an id or a slug — because legacy rows
 * store the link under `destination`, `destination_id` or `destination_slug`.
 * Filtering happens in Postgres rather than pulling the whole table into JS.
 */
export async function getHotelsByDestinationRefs(refs: (string | undefined)[]) {
    const unique = [...new Set(refs.filter(Boolean) as string[])];
    if (unique.length === 0) return [];

    const supabase = supabaseAdmin();

    const orParts: string[] = [];
    for (const ref of unique) {
        orParts.push(`destination.eq.${ref}`, `destination_id.eq.${ref}`, `destination_slug.eq.${ref}`);
    }

    const { data, error } = await supabase.from(TABLE).select("*").or(orParts.join(","));
    if (error) throw error;

    return resolveDestinations(rowsToDocs<Hotel>(data));
}

export async function getHotelsByDestination(destinationId?: string, slug?: string) {
    return getHotelsByDestinationRefs([destinationId, slug]);
}
