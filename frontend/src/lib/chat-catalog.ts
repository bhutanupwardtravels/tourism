import { getAllTours } from "@/lib/data/tours";
import { getAllDestinations } from "@/lib/data/destinations";
import { getAllExperiences } from "@/lib/data/experiences";
import { getAllHotels } from "@/lib/data/hotels";
import { getAllCosts } from "@/lib/data/settings";
import { getAboutContent } from "@/lib/data/about";
import { getContactContent } from "@/lib/data/contact";

// SECURITY BOUNDARY: this file is the entire set of data the chatbot can see.
// Only fetch tables that are already public-facing content (same info shown
// elsewhere on the site). Never import tour-requests (customer PII: names,
// emails, phone numbers) or users/auth data here — the model can't leak what
// it's never given, so this list is the real access-control boundary, not
// just the system prompt's wording.

// Cached so a live-catalog fetch isn't triggered on every chat message; the
// underlying content (tours, destinations, experiences, hotels, costs, about,
// contact) changes rarely enough that a short TTL keeps the assistant's
// answers fresh without adding DB load/latency to every request.
const CATALOG_TTL_MS = 5 * 60 * 1000;

let cache: { text: string; expiresAt: number } | null = null;

interface ExperienceWithResolvedRefs {
    title: string;
    category?: string;
    description?: string;
    duration?: string;
    difficulty?: string;
    price?: number;
    destinationSlug?: string;
    resolvedDestinations?: string[];
}

interface HotelWithResolvedDestination {
    name: string;
    description?: string;
    rating: number;
    price?: number;
    priceRange?: string;
    amenities?: string[];
    destinationSlug?: string;
    resolvedDestinationName?: string;
}

function truncate(text: string | undefined | null, maxLength: number): string {
    if (!text) return "";
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > maxLength ? `${clean.slice(0, maxLength).trimEnd()}…` : clean;
}

export async function getCatalogContext(): Promise<string> {
    if (cache && cache.expiresAt > Date.now()) {
        return cache.text;
    }

    try {
        const [tours, destinations, experiences, hotels, costs, about, contact] = await Promise.all([
            getAllTours(),
            getAllDestinations(),
            getAllExperiences(),
            getAllHotels(),
            getAllCosts(),
            getAboutContent().catch(() => null),
            getContactContent().catch(() => null),
        ]);

        const text = [
            "=== CURRENT TOUR PACKAGES (from live site data) ===",
            ...tours.map(
                (t) =>
                    `- ${t.title} (${t.duration}, ${t.category ?? "General"}): $${t.price}/person. Highlights: ${(t.highlights ?? []).slice(0, 3).join(", ") || "n/a"}`
            ),

            "\n=== DESTINATIONS (from live site data) ===",
            ...destinations.map(
                (d) => `- ${d.name} (${d.region}${d.isEntryPoint ? ", entry point" : ""}): ${truncate(d.description, 300)}`
            ),

            "\n=== EXPERIENCES / ACTIVITIES (from live site data) ===",
            ...experiences.map((e: ExperienceWithResolvedRefs) => {
                const dest = (e.resolvedDestinations ?? []).join(", ") || e.destinationSlug || "various";
                const price = e.price != null ? `$${e.price}` : "n/a";
                return `- ${e.title} [${dest}], ${e.category ?? "General"}, ${e.duration ?? "n/a"}, ${e.difficulty ?? "n/a"}, ${price}: ${truncate(e.description, 150)}`;
            }),

            "\n=== HOTELS / ACCOMMODATION (from live site data) ===",
            ...hotels.map((h: HotelWithResolvedDestination) => {
                const dest = h.resolvedDestinationName ?? h.destinationSlug ?? "various";
                const price = h.price != null ? `$${h.price}/night` : h.priceRange;
                return `- ${h.name} [${dest}], rating ${h.rating}/5, ${price}, amenities: ${(h.amenities ?? []).slice(0, 4).join(", ") || "n/a"}: ${truncate(h.description, 120)}`;
            }),

            "\n=== FEES / COSTS (from live site data) ===",
            ...costs.map(
                (c) =>
                    `- ${c.title}: $${c.price} (${c.type}, ${c.travelerCategory}${c.isIndianNational ? ", Indian national rate" : ""})`
            ),

            ...(about
                ? [
                      "\n=== ABOUT US (from live site data) ===",
                      `${about.hero?.title ?? ""} — ${truncate(about.hero?.content, 300)}`,
                      `Our story: ${truncate(about.story?.content, 400)}`,
                      about.mission?.items?.length
                          ? `Our mission: ${about.mission.items.map((m) => m.title).join("; ")}`
                          : "",
                      about.sustainable?.items?.length
                          ? `Sustainability commitments: ${about.sustainable.items.map((s) => s.title).join("; ")}`
                          : "",
                  ].filter(Boolean)
                : []),

            ...(contact
                ? [
                      "\n=== CONTACT INFO (from live site data) ===",
                      `Email: ${contact.email || "n/a"}, Phone: ${contact.phone || "n/a"}, WhatsApp: ${contact.whatsapp || "n/a"}, Address: ${contact.address || "n/a"}`,
                  ]
                : []),
        ].join("\n");

        cache = { text, expiresAt: Date.now() + CATALOG_TTL_MS };
        return text;
    } catch (error) {
        console.error("Failed to fetch live catalog context for chat:", error);
        // Serve stale data over none if we have it; otherwise degrade to FAQ-only.
        return cache?.text ?? "";
    }
}
