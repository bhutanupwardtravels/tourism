import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { PageHeader } from "@/components/common/page-header";
import { FaqSection } from "@/components/common/faq-section";
import { JsonLd } from "@/components/common/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getFaqContent } from "@/lib/data/faq";
import Link from "next/link";
import { guides } from "@/lib/content/guides";
import CallToAction from "@/components/common/call-to-action";

export const metadata: Metadata = buildMetadata({
    title: "Bhutan Travel Guide — Costs, Visa, Best Time to Visit",
    description:
        "Everything you need to plan a trip to Bhutan: tour costs, the Sustainable Development Fee, visa requirements, best time to visit, and how many days to spend.",
    path: "/bhutan-travel-guide",
});

export default async function BhutanTravelGuidePage() {
    const faqContent = await getFaqContent();

    return (
        <main className="min-h-screen bg-white text-black">
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Bhutan Travel Guide", path: "/bhutan-travel-guide" },
                ])}
            />
            <PageHeader
                label="// plan your journey"
                title="Bhutan Travel Guide"
                description="Practical answers on cost, visas, timing, and what to expect — gathered from years of running tours across the Kingdom of Bhutan."
                bgText="Guide"
            />

            <div className="container mx-auto px-6 pb-4">
                <p className="max-w-3xl text-lg leading-relaxed text-black/70">
                    Planning a trip to Bhutan is different from most destinations: every
                    international tourist travels with a licensed local operator, pays a
                    government Sustainable Development Fee, and books a guide and visa as
                    part of one package. Bhutan Upward Travels handles all of this directly.
                    The answers below cover the questions travellers ask most before booking.
                </p>
            </div>

            <section className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-light tracking-tight mb-6">Bhutan travel guides</h2>
                <ul className="grid gap-4 md:grid-cols-2 max-w-4xl">
                    {guides.map((g) => (
                        <li key={g.slug} className="border border-black/10 p-5">
                            <Link
                                href={`/bhutan-travel-guide/${g.slug}`}
                                className="text-lg underline hover:text-amber-600"
                            >
                                {g.heading}
                            </Link>
                            <p className="mt-2 text-sm text-black/60 leading-relaxed">{g.description}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <FaqSection
                label="// the essentials"
                title="Frequently Asked Questions"
                bgText="FAQ"
                items={faqContent.items}
            />

            <CallToAction />
        </main>
    );
}
