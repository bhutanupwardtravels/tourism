import type { MetadataRoute } from "next";
import { listSlugs } from "@/lib/data/slugs";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = siteUrl();

    const staticRoutes: MetadataRoute.Sitemap = [
        "",
        "/destinations",
        "/experiences",
        "/tours",
        "/hotels",
        "/about-us",
        "/plan-my-trip",
        "/enquire",
    ].map((path) => ({
        url: `${base}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
    }));

    const [tours, destinations, experiences, hotels] = await Promise.all([
        listSlugs("tours"),
        listSlugs("destinations"),
        listSlugs("experiences"),
        listSlugs("hotels"),
    ]);

    const entityRoutes: MetadataRoute.Sitemap = [
        ...tours.map((slug) => `/tours/${slug}`),
        ...destinations.map((slug) => `/destinations/${slug}`),
        ...experiences.map((slug) => `/experiences/${slug}`),
        ...hotels.map((slug) => `/hotels/${slug}`),
    ].map((path) => ({
        url: `${base}${path}`,
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    return [...staticRoutes, ...entityRoutes];
}
