import type { MetadataRoute } from "next";
import { listSlugEntries, type SlugEntry } from "@/lib/data/slugs";
import { guides } from "@/lib/content/guides";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const BUILD_TIME = new Date();

function toEntityRoutes(
    base: string,
    prefix: string,
    entries: SlugEntry[]
): MetadataRoute.Sitemap {
    return entries.map(({ slug, updatedAt }) => ({
        url: `${base}${prefix}/${slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : BUILD_TIME,
        changeFrequency: "weekly",
        priority: 0.6,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = siteUrl();

    const staticRoutes: MetadataRoute.Sitemap = [
        "",
        "/destinations",
        "/experiences",
        "/tours",
        "/hotels",
        "/about-us",
        "/bhutan-travel-guide",
        "/plan-my-trip",
        "/enquire",
    ].map((path) => ({
        url: `${base}${path}`,
        lastModified: BUILD_TIME,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
    }));

    const [tours, destinations, experiences, hotels] = await Promise.all([
        listSlugEntries("tours"),
        listSlugEntries("destinations"),
        listSlugEntries("experiences"),
        listSlugEntries("hotels"),
    ]);

    const entityRoutes: MetadataRoute.Sitemap = [
        ...toEntityRoutes(base, "/tours", tours),
        ...toEntityRoutes(base, "/destinations", destinations),
        ...toEntityRoutes(base, "/experiences", experiences),
        ...toEntityRoutes(base, "/hotels", hotels),
    ];

    // Tour-day sub-pages are intentionally left out of the sitemap: they're
    // noindex'd (see tours/[slug]/day/[day]/page.tsx) since their content
    // duplicates the parent tour page, so listing them here would just send
    // Google a contradictory signal.

    const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
        url: `${base}/bhutan-travel-guide/${g.slug}`,
        lastModified: BUILD_TIME,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...guideRoutes, ...entityRoutes];
}
