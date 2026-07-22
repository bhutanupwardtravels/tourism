import { supabaseAdmin } from "../supabase/admin";
import { bhutanFaqs, homeFaqs } from "@/lib/content/bhutan-faq";

const TABLE = "site_faq";

export interface FaqEntry {
    question: string;
    answer: string;
    homepage: boolean;
}

export interface FaqContent {
    items: FaqEntry[];
    updatedAt?: string;
}

function defaultFaqContent(): FaqContent {
    const homepageQuestions = new Set(homeFaqs.map((item) => item.question));
    return {
        items: bhutanFaqs.map((item) => ({
            ...item,
            homepage: homepageQuestions.has(item.question),
        })),
    };
}

export async function getFaqContent(): Promise<FaqContent> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase
        .from(TABLE)
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();

    if (!row) return defaultFaqContent();

    const doc = row.content as Partial<FaqContent>;
    if (!doc.items || doc.items.length === 0) return defaultFaqContent();

    return {
        items: doc.items,
        updatedAt: row.updated_at,
    };
}

export async function updateFaqContent(data: FaqContent) {
    const supabase = supabaseAdmin();
    const { updatedAt: _updatedAt, ...content } = data;

    const { error } = await supabase.from(TABLE).upsert({
        id: 1,
        content,
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return { acknowledged: true };
}
