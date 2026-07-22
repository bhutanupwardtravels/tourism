import type { Metadata } from "next";

export const SITE_NAME = "Bhutan Upward Travels";

// Canonical site origin. Set NEXT_PUBLIC_SITE_URL in production; on Vercel the
// project production URL is used as a fallback so OG/sitemap URLs are absolute.
export function siteUrl(): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    return "http://localhost:3000";
}

function truncate(text: string, max = 160): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const sliced = clean.slice(0, max - 1);
    const lastSpace = sliced.lastIndexOf(" ");
    const boundary = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
    return `${boundary.trimEnd()}…`;
}

interface PageMeta {
    title: string;
    description?: string;
    image?: string;
    path: string;
}

export function buildMetadata({ title, description, image, path }: PageMeta): Metadata {
    const desc = description ? truncate(description) : undefined;
    return {
        title,
        description: desc,
        alternates: { canonical: path },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description: desc,
            url: path,
            siteName: SITE_NAME,
            type: "website",
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title: `${title} | ${SITE_NAME}`,
            description: desc,
            ...(image ? { images: [image] } : {}),
        },
    };
}
