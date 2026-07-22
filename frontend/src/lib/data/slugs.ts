import { supabaseAdmin } from "../supabase/admin";

export interface SlugEntry {
    slug: string;
    updatedAt: string | null;
}

// Lightweight slug listing used by generateStaticParams to prebuild detail
// pages and by the sitemap to set lastModified. Returns [] on any failure so
// a build never breaks on data issues — pages then render on demand instead.
export async function listSlugEntries(
    table: "tours" | "destinations" | "experiences" | "hotels"
): Promise<SlugEntry[]> {
    try {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase.from(table).select("slug, updated_at");
        if (error) {
            console.error(`listSlugEntries(${table}) failed:`, error.message);
            return [];
        }
        return (data ?? [])
            .filter((row) => Boolean(row.slug))
            .map((row) => ({ slug: row.slug, updatedAt: row.updated_at ?? null }));
    } catch (err) {
        console.error(`listSlugEntries(${table}) threw:`, err);
        return [];
    }
}

export async function listSlugs(
    table: "tours" | "destinations" | "experiences" | "hotels"
): Promise<string[]> {
    const entries = await listSlugEntries(table);
    return entries.map((entry) => entry.slug);
}

export interface TourDayEntry {
    slug: string;
    day: number;
    updatedAt: string | null;
}

// Per-day itinerary routes (/tours/[slug]/day/[day]) for the sitemap, now that
// each day has its own indexable title/description.
export async function listTourDayEntries(): Promise<TourDayEntry[]> {
    try {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase.from("tours").select("slug, days, updated_at");
        if (error) {
            console.error("listTourDayEntries failed:", error.message);
            return [];
        }
        return (data ?? []).flatMap((row) => {
            const days = Array.isArray(row.days) ? row.days : [];
            return days
                .map((d: { day?: number }) => d?.day)
                .filter((day: unknown): day is number => typeof day === "number")
                .map((day: number) => ({
                    slug: row.slug,
                    day,
                    updatedAt: row.updated_at ?? null,
                }));
        });
    } catch (err) {
        console.error("listTourDayEntries threw:", err);
        return [];
    }
}
