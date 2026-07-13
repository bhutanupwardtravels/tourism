import { supabaseAdmin } from "../supabase/admin";

const TABLE = "site_contact";

export interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
}

export interface ContactContent {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    socials: SocialLinks;
    updatedAt?: string;
}

function defaultContactContent(): ContactContent {
    return {
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        socials: {
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: "",
        },
    };
}

export async function getContactContent(): Promise<ContactContent> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase
        .from(TABLE)
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();

    const defaults = defaultContactContent();
    if (!row) return defaults;

    const doc = row.content as Partial<ContactContent>;
    return {
        ...defaults,
        ...doc,
        socials: { ...defaults.socials, ...doc.socials },
        updatedAt: row.updated_at,
    };
}

export async function updateContactContent(data: ContactContent) {
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
