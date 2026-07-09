import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, paginate, pageRange, UUID_RE } from "../supabase/mapping";

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
async function resolveDestinations(docs: any[]): Promise<any[]> {
    if (docs.length === 0) return docs;
    const supabase = supabaseAdmin();

    const { data: dests } = await supabase.from("destinations").select("id, name, slug");
    const byId = new Map((dests ?? []).map((d) => [d.id, d]));
    const bySlug = new Map((dests ?? []).map((d) => [d.slug, d]));

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
        items: await resolveDestinations((data ?? []).map(rowToDoc)),
        ...paginate(count ?? 0, page, pageSize),
    };
}

export async function getHotelById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        if (!data) return null;
        const [resolved] = await resolveDestinations([rowToDoc(data)]);
        return resolved;
    } catch (e) {
        return null;
    }
}

export async function getHotelBySlug(slug: string) {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    if (!data) return null;
    const [resolved] = await resolveDestinations([rowToDoc(data)]);
    return resolved;
}

export async function createHotel(data: any) {
    const supabase = supabaseAdmin();
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert(docToRow(data, COLUMNS))
        .select("id")
        .single();
    if (error) throw error;
    return inserted.id;
}

export async function updateHotel(id: string, data: any) {
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

export async function getAllHotels() {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").order("name");
    if (error) throw error;
    return resolveDestinations((data ?? []).map(rowToDoc));
}

export async function getHotelsByDestination(destinationId?: string, slug?: string) {
    if (!destinationId && !slug) return [];

    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;

    const docs = (data ?? []).map(rowToDoc).filter((doc: any) => {
        if (destinationId && (doc.destinationId === destinationId || doc.destination === destinationId)) return true;
        if (slug && (doc.destinationSlug === slug || doc.destination === slug)) return true;
        return false;
    });

    return resolveDestinations(docs);
}
