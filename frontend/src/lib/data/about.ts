import { supabaseAdmin } from "../supabase/admin";

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

export interface SustainabilityItem {
    id: string;
    title: string;
    description: string;
    order: number;
}

export interface AboutContent {
    hero: AboutSection;
    story: AboutSection;
    mission: {
        title: string;
        subtitle: string;
        image: string;
        items: MissionItem[];
    };
    purpose: AboutSection;
    sustainable: {
        title: string;
        subtitle: string;
        intro: string;
        image: string;
        items: SustainabilityItem[];
    };
    updatedAt?: string;
}

export async function getAboutContent(): Promise<AboutContent> {
    const supabase = supabaseAdmin();
    const { data: row } = await supabase.from(TABLE).select("content, updated_at").eq("id", 1).maybeSingle();
    const doc = row ? { ...(row.content as any), updatedAt: row.updated_at } : null;

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
        hero: { ...defaultContent.hero, ...doc.hero },
        story: { ...defaultContent.story, ...doc.story },
        purpose: { ...defaultContent.purpose, ...doc.purpose },
    };

    // Special handling for legacy mission/sustainable which were objects
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

    if (doc.sustainable && !Array.isArray(doc.sustainable.items)) {
        merged.sustainable = {
            ...defaultContent.sustainable,
            title: doc.sustainable.title || defaultContent.sustainable.title,
            intro: doc.sustainable.intro || defaultContent.sustainable.intro,
            items: [
                {
                    id: "sustainability-1",
                    title: doc.sustainable.title || "Default Sustainability",
                    description: doc.sustainable.content || "",
                    order: 1
                }
            ]
        };
    } else if (doc.sustainable) {
        merged.sustainable = { ...defaultContent.sustainable, ...doc.sustainable };
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
        sustainable: {
            title: "Conservation Protocol",
            subtitle: "philosophical framework",
            intro: "Bhutan's approach to tourism is built on sustainability. We're proud to uphold and enhance these principles in every journey we create.",
            image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=2940&auto=format&fit=crop",
            items: [
                {
                    id: "sustainability-1",
                    title: "Responsible Tourism",
                    description: "We are committed to responsible tourism practices that preserve Bhutan's pristine environment and rich cultural heritage for future generations. Every journey we create follows sustainable principles.",
                    order: 1
                }
            ]
        },
    };
}

export async function updateAboutContent(data: AboutContent) {
    const supabase = supabaseAdmin();
    const { updatedAt: _updatedAt, ...content } = data as any;

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
    (defaultContent as any).updatedAt = new Date().toISOString();

    // Insert default content into database
    const supabase = supabaseAdmin();
    await supabase.from(TABLE).upsert({ id: 1, content: defaultContent });

    return defaultContent;
}
