import { supabaseAdmin } from "../supabase/admin";

// Lightweight slug listing used by generateStaticParams to prebuild detail
// pages. Returns [] on any failure so a build never breaks on data issues —
// pages then render on demand instead.
export async function listSlugs(
    table: "tours" | "destinations" | "experiences" | "hotels"
): Promise<string[]> {
    try {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(table).select("slug");
        return (data ?? []).map((row) => row.slug).filter(Boolean);
    } catch {
        return [];
    }
}
