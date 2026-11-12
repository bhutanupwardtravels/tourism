import { guides } from "@/lib/content/guides";
import { siteUrl, SITE_NAME } from "@/lib/site";
import { getAllTours } from "@/lib/data/tours";
import { getFaqContent } from "@/lib/data/faq";

export const revalidate = 3600;

interface TourSummary {
    title: string;
    slug: string;
    duration?: string;
    price?: number;
}

async function loadTourSummaries(): Promise<TourSummary[]> {
    try {
        const tours = await getAllTours();
        return (tours as TourSummary[]).map((tour) => ({
            title: tour.title,
            slug: tour.slug,
            duration: tour.duration,
            price: tour.price,
        }));
    } catch {
        return [];
    }
}

export async function GET() {
    const base = siteUrl();
    const [tours, faqContent] = await Promise.all([loadTourSummaries(), getFaqContent()]);

    // Follows the llms.txt spec (llmstxt.org): H1, a blockquote summary, then
    // H2 sections whose list items are markdown links — `[name](url): notes`,
    // not bare "label: url" text — so link-aware crawlers can actually parse
    // them as links instead of plain lines.
    const lines: string[] = [
        `# ${SITE_NAME}`,
        "",
        "> Bhutan Upward Travels is a licensed tour operator based in Thimphu, Bhutan, offering curated tours, custom itineraries, experiences, and boutique hotel stays across Bhutan (Paro, Thimphu, Punakha, and beyond).",
        "",
        "## Key Pages",
        `- [Homepage](${base}/): Overview of Bhutan Upward Travels and featured tours.`,
        `- [Tours](${base}/tours): Browse all Bhutan tour packages.`,
        `- [Destinations](${base}/destinations): Regions and dzongkhags covered.`,
        `- [Experiences](${base}/experiences): Curated activities and excursions.`,
        `- [Hotels](${base}/hotels): Vetted accommodation across Bhutan.`,
        `- [About Us](${base}/about-us): Company background, license, and credentials.`,
        `- [Bhutan Travel Guide](${base}/bhutan-travel-guide): FAQs and planning guides — cost, visa, best time to visit, and more.`,
        `- [Plan My Trip](${base}/plan-my-trip): Build a custom itinerary or choose a package.`,
        `- [Enquire / Contact](${base}/enquire): Start a booking enquiry.`,
        "",
    ];

    if (tours.length > 0) {
        lines.push("## Tours");
        for (const tour of tours) {
            const details = [tour.duration, tour.price ? `from $${tour.price} USD` : null]
                .filter(Boolean)
                .join(", ");
            lines.push(
                `- [${tour.title}](${base}/tours/${tour.slug})${details ? `: ${details}` : ""}`
            );
        }
        lines.push("");
    }

    lines.push("## Bhutan Travel Guides");
    for (const g of guides) {
        lines.push(`- [${g.heading}](${base}/bhutan-travel-guide/${g.slug}): ${g.description}`);
    }
    lines.push("");

    if (faqContent.items.length > 0) {
        lines.push("## Optional");
        lines.push(
            `- [Frequently Asked Questions](${base}/bhutan-travel-guide): ${faqContent.items
                .slice(0, 6)
                .map((f) => f.question)
                .join(" ")}`
        );
    }

    return new Response(lines.join("\n"), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
}
