import { supabaseAdmin } from "../supabase/admin";
import { omit } from "@/lib/utils";

const TABLE = "about";

export interface AboutSection {
    title: string;
    subtitle: string;
    content: string;
    image: string;
}

export interface MissionItem {
    id: string;
    title: string;
    description: string;
    order: number;
}

export interface TrustItem {
    id: string;
    title: string;
    description: string;
    order: number;
}

export interface WhyBhutanItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

export interface AboutContent {
    hero: AboutSection;
    story: AboutSection;
    founder: {
        title: string;
        subtitle: string;
        name: string;
        role: string;
        nationality: string;
        experience: string;
        bio: string;
        image: string;
    };
    mission: {
        title: string;
        subtitle: string;
        image: string;
        items: MissionItem[];
    };
    purpose: AboutSection;
    credentials: {
        title: string;
        subtitle: string;
        licenseNumber: string;
        foundingYear: string;
        guideCredentials: string;
        emergencySupport: string;
        items: TrustItem[];
    };
    whyBhutan: {
        title: string;
        subtitle: string;
        items: WhyBhutanItem[];
    };
    updatedAt?: string;
}

export async function getAboutContent(): Promise<AboutContent> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase.from(TABLE).select("content, updated_at").eq("id", 1).maybeSingle();
    // Stored rows predate several shape changes, so every section is optional and
    // `mission` may still be the pre-array object with a `content` string.
    type StoredAboutContent = Partial<Omit<AboutContent, "mission">> & {
        mission?: Partial<AboutContent["mission"]> & { content?: string };
    };
    const doc = row ? { ...(row.content as StoredAboutContent), updatedAt: row.updated_at } : null;

    if (!doc) {
        // Return default content if none exists
        return createDefaultAboutContent();
    }

    // Handle migration from old structure
    const defaultContent = await getStaticDefaultContent();

    // Merge doc with defaults to ensure all fields exist
    const merged: AboutContent = {
        ...defaultContent,
        ...doc,
        // Seeded from defaults here and then rebuilt below, which is where the
        // legacy single-object mission shape gets normalised into items[].
        mission: defaultContent.mission,
        hero: { ...defaultContent.hero, ...doc.hero },
        story: { ...defaultContent.story, ...doc.story },
        founder: { ...defaultContent.founder, ...doc.founder },
        purpose: { ...defaultContent.purpose, ...doc.purpose },
        credentials: {
            ...defaultContent.credentials,
            ...doc.credentials,
            items: Array.isArray(doc.credentials?.items) ? doc.credentials.items : defaultContent.credentials.items,
        },
        whyBhutan: {
            ...defaultContent.whyBhutan,
            ...doc.whyBhutan,
            items: Array.isArray(doc.whyBhutan?.items) ? doc.whyBhutan.items : defaultContent.whyBhutan.items,
        },
    };

    // Special handling for legacy mission which was a single object, not an array
    if (doc.mission && !Array.isArray(doc.mission.items)) {
        merged.mission = {
            ...defaultContent.mission,
            title: doc.mission.title || defaultContent.mission.title,
            items: [
                {
                    id: "mission-1",
                    title: doc.mission.title || "Default Mission",
                    description: doc.mission.content || "",
                    order: 1
                }
            ]
        };
    } else if (doc.mission) {
        merged.mission = { ...defaultContent.mission, ...doc.mission };
    }

    return merged;
}

async function getStaticDefaultContent(): Promise<AboutContent> {
    return {
        hero: {
            title: "About Us",
            subtitle: "Discover the heart of Bhutan through authentic experiences",
            content: "Welcome to our journey through the Land of the Thunder Dragon",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2940&auto=format&fit=crop",
        },
        story: {
            title: "It Began with a Feeling",
            subtitle: "Our Story",
            content: "Our journey started with a deep fascination for Bhutan—a land where happiness is measured not in wealth, but in the wellbeing of its people and the preservation of its culture.\n\nWe wanted to create more than just tours. We envisioned experiences that would sweep aside the ordinary and connect travelers with the extraordinary spirit of the Himalayan kingdom.\n\nSince our founding, we've become curators of tailor-made travel experiences—all crafted with inspirational care and an incomparable attention to detail. For us, the most important question has always been: how do you want to feel?",
            image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=2940&auto=format&fit=crop",
        },
        founder: {
            title: "About the Founder",
            subtitle: "FOUNDER",
            name: "Ms. Lhamchu Delma",
            role: "",
            nationality: "",
            experience: "14 years",
            bio: "Ms. Lhamchu Delma is the founder and guiding force behind Bhutan Upward Travels, bringing about more than 14 years of professional experience in teaching and management. Under her leadership, the company crafts meaningful travel experiences that reflect Bhutan's values of Gross National Happiness, sustainability, and genuine human connection.",
            image: "",
        },
        mission: {
            title: "Mission Parameters",
            subtitle: "strategic objectives",
            image: "https://images.unsplash.com/photo-1528493366411-96860956903e?w=2940&auto=format&fit=crop",
            items: [
                {
                    id: "mission-1",
                    title: "Authentic Experiences",
                    description: "To provide travelers with authentic, sustainable, and transformative experiences that honor Bhutan's unique culture, environment, and philosophy of Gross National Happiness.",
                    order: 1
                }
            ]
        },
        purpose: {
            title: "Travel with Purpose",
            subtitle: "Our Purpose",
            content: "We believe travel should be transformative. Every journey we craft is designed to leave you changed—enriched by the places you've been, the people you've met, and the experiences you've collected.\n\nOur purpose is to open doors to Bhutan's hidden treasures while ensuring that tourism contributes positively to the preservation of its unique way of life.\n\nWhen you travel with us, you're not just a visitor—you become part of Bhutan's story, and Bhutan becomes part of yours.",
            image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=2940&auto=format&fit=crop",
        },
        credentials: {
            title: "Credentials & Trust",
            subtitle: "why travel with us",
            // Intentionally blank — these are verifiable facts (license number,
            // founding year, guide certification, emergency support) that must
            // be supplied by the operator via the admin panel, not invented.
            // Public components hide any field left empty here.
            licenseNumber: "",
            foundingYear: "",
            guideCredentials: "",
            emergencySupport: "",
            items: []
        },
        whyBhutan: {
            title: "The Kingdom of Happiness",
            subtitle: "unique identifiers",
            items: [
                {
                    id: "gross-national-happiness",
                    title: "Gross National Happiness",
                    icon: "smile",
                    description: "Bhutan measures progress through Gross National Happiness rather than GDP, prioritizing the wellbeing of its people and environment over economic growth alone.",
                    order: 1
                },
                {
                    id: "pristine-nature",
                    title: "Pristine Nature",
                    icon: "mountain",
                    description: "With 72% forest coverage and a constitutional mandate to maintain at least 60% of the land under forest cover, Bhutan offers some of the world's most pristine landscapes.",
                    order: 2
                },
                {
                    id: "living-culture",
                    title: "Living Culture",
                    icon: "heart",
                    description: "In Bhutan, culture isn't preserved in museums—it's alive in daily life. From traditional dress to ancient festivals, Bhutanese culture thrives in the modern world.",
                    order: 3
                },
                {
                    id: "spiritual-heritage",
                    title: "Spiritual Heritage",
                    icon: "sparkles",
                    description: "Buddhism permeates every aspect of Bhutanese life, offering travelers a chance to explore profound spiritual traditions and practices in their authentic context.",
                    order: 4
                },
                {
                    id: "sustainable-development",
                    title: "Sustainable Development",
                    icon: "leaf",
                    description: "Bhutan's approach to development balances modernization with tradition, proving that progress and preservation can coexist harmoniously.",
                    order: 5
                },
                {
                    id: "exclusive-access",
                    title: "Exclusive Access",
                    icon: "key",
                    description: "Bhutan's high-value tourism policy means fewer crowds and more meaningful interactions, offering an exclusive and intimate travel experience.",
                    order: 6
                }
            ]
        },
    };
}

export async function updateAboutContent(data: AboutContent) {
    const supabase = supabaseAdmin();
    const content = omit(data, "updatedAt");

    // Upsert: update if exists, insert if not
    const { error } = await supabase.from(TABLE).upsert({
        id: 1,
        content,
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return { acknowledged: true };
}

async function createDefaultAboutContent(): Promise<AboutContent> {
    const defaultContent = await getStaticDefaultContent();
    defaultContent.updatedAt = new Date().toISOString();

    // Insert default content into database
    const supabase = supabaseAdmin();
    await supabase.from(TABLE).upsert({ id: 1, content: defaultContent });

    return defaultContent;
}
