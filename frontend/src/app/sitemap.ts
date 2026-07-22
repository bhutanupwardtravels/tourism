import type { MetadataRoute } from "next";
import { listSlugEntries, listTourDayEntries, type SlugEntry } from "@/lib/data/slugs";
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

    const [tours, destinations, experiences, hotels, tourDays] = await Promise.all([
        listSlugEntries("tours"),
        listSlugEntries("destinations"),
        listSlugEntries("experiences"),
        listSlugEntries("hotels"),
        listTourDayEntries(),
    ]);

    const entityRoutes: MetadataRoute.Sitemap = [
        ...toEntityRoutes(base, "/tours", tours),
        ...toEntityRoutes(base, "/destinations", destinations),
        ...toEntityRoutes(base, "/experiences", experiences),
        ...toEntityRoutes(base, "/hotels", hotels),
    ];

    const tourDayRoutes: MetadataRoute.Sitemap = tourDays.map(({ slug, day, updatedAt }) => ({
        url: `${base}/tours/${slug}/day/${day}`,
        lastModified: updatedAt ? new Date(updatedAt) : BUILD_TIME,
        changeFrequency: "monthly",
        priority: 0.4,
    }));

    return [...staticRoutes, ...entityRoutes, ...tourDayRoutes];
}
