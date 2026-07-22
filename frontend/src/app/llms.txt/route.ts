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

    const lines: string[] = [
        `# ${SITE_NAME}`,
        "",
        "> Bhutan Upward Travels is a licensed tour operator based in Thimphu, Bhutan, offering curated tours, custom itineraries, experiences, and boutique hotel stays across Bhutan (Paro, Thimphu, Punakha, and beyond).",
        "",
        "## Key Pages",
        `- Homepage: ${base}/`,
        `- Tours: ${base}/tours`,
        `- Destinations: ${base}/destinations`,
        `- Experiences: ${base}/experiences`,
        `- Hotels: ${base}/hotels`,
        `- About Us: ${base}/about-us`,
        `- Bhutan Travel Guide (FAQ): ${base}/bhutan-travel-guide`,
        `- Plan My Trip: ${base}/plan-my-trip`,
        `- Enquire / Contact: ${base}/enquire`,
        "",
    ];

    if (tours.length > 0) {
        lines.push("## Tours");
        for (const tour of tours) {
            const details = [tour.duration, tour.price ? `from $${tour.price} USD` : null]
                .filter(Boolean)
                .join(", ");
            lines.push(`- ${tour.title}${details ? ` (${details})` : ""}: ${base}/tours/${tour.slug}`);
        }
        lines.push("");
    }

    lines.push("## Travel Guide Topics");
    for (const faq of faqContent.items) {
        lines.push(`- ${faq.question}`);
    }
    lines.push("", `Full answers: ${base}/bhutan-travel-guide`);

    return new Response(lines.join("\n"), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
