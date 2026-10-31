import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, SITE_NAME } from "@/lib/site";
import { PageHeader } from "@/components/common/page-header";
import { FaqSection } from "@/components/common/faq-section";
import { JsonLd } from "@/components/common/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import CallToAction from "@/components/common/call-to-action";
import { getGuide, guides } from "@/lib/content/guides";

interface Props {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return guides.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) return {};
    return buildMetadata({
        title: guide.title,
        description: guide.description,
        path: `/bhutan-travel-guide/${guide.slug}`,
    });
}

export default async function GuidePage({ params }: Props) {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) notFound();

    const path = `/bhutan-travel-guide/${guide.slug}`;
    const related = guides.filter((g) => g.slug !== guide.slug).slice(0, 4);

    return (
        <main className="min-h-screen bg-white text-black">
            <JsonLd
                data={[
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Bhutan Travel Guide", path: "/bhutan-travel-guide" },
                        { name: guide.heading, path },
                    ]),
                    {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: guide.heading,
                        description: guide.description,
                        author: { "@type": "Organization", name: SITE_NAME },
                        publisher: { "@type": "Organization", name: SITE_NAME },
                        mainEntityOfPage: path,
                    },
                ]}
            />
            <PageHeader
                label="// bhutan travel guide"
                title={guide.heading}
                description={guide.description}
                bgText="Guide"
            />

            <article className="container mx-auto px-6 pb-16">
                <p className="max-w-3xl text-lg leading-relaxed text-black/70">{guide.intro}</p>

                {guide.sections.map((section) => (
                    <section key={section.heading} className="mt-12 max-w-3xl">
                        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                            {section.heading}
                        </h2>
                        {section.paragraphs.map((p) => (
                            <p key={p} className="mb-4 leading-relaxed text-black/70">
                                {p}
                            </p>
                        ))}
                        {section.bullets && (
                            <ul className="list-disc pl-6 space-y-2 text-black/70 leading-relaxed">
                                {section.bullets.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <div className="mt-14 max-w-3xl border-t border-black/10 pt-8">
                    <p className="text-black/70 leading-relaxed">
                        Ready to plan? Browse our{" "}
                        <Link href="/tours" className="underline hover:text-amber-600">
                            Bhutan tour packages
                        </Link>
                        , explore{" "}
                        <Link href="/destinations" className="underline hover:text-amber-600">
                            destinations
                        </Link>
                        , or{" "}
                        <Link href="/plan-my-trip" className="underline hover:text-amber-600">
                            plan your trip
                        </Link>{" "}
                        with a licensed Bhutanese specialist.
                    </p>
                </div>

                <nav aria-label="More Bhutan travel guides" className="mt-12 max-w-3xl">
                    <h2 className="text-xl font-light tracking-tight mb-3">More Bhutan guides</h2>
                    <ul className="space-y-2">
                        {related.map((g) => (
                            <li key={g.slug}>
                                <Link
                                    href={`/bhutan-travel-guide/${g.slug}`}
                                    className="underline text-black/70 hover:text-amber-600"
                                >
                                    {g.heading}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </article>

            <FaqSection
                label="// quick answers"
                title="Common Questions"
                bgText="FAQ"
                items={guide.faqs}
            />

            <CallToAction />
        </main>
    );
}
