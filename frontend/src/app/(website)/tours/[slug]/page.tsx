import { notFound } from "next/navigation";
import { TourHero } from "./components/tour-hero";
import { TourCarousel } from "./components/tour-carousel";
import { TourItinerary } from "./components/tour-itenary";
import { TourOverview } from "./components/tour-overview";
import { getTourBySlug, getRelatedTours } from "../actions";
import CallToAction from "@/components/common/call-to-action";
import { TourActionBar } from "./components/tour-action-bar";
import { JsonLd } from "@/components/common/json-ld";
import { FaqSection } from "@/components/common/faq-section";
import { getFaqContent } from "@/lib/data/faq";
import { tourJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

import type { Metadata } from "next";
import { listSlugs } from "@/lib/data/slugs";
import { buildMetadata } from "@/lib/site";

export async function generateStaticParams() {
    const slugs = await listSlugs("tours");
    return slugs.map((slug) => ({ slug }));
}

const TOUR_PAGE_FAQ_QUESTIONS = [
    "What is the best time to visit Bhutan?",
    "How far in advance should I book a Bhutan tour?",
    "What should I pack for a trip to Bhutan, and is altitude a concern?",
    "Do I need a visa to visit Bhutan?",
    "Do I need a licensed guide to travel in Bhutan?",
    "What currency is used in Bhutan and how do I pay for a tour?",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);
    if (!tour) return {};
    return buildMetadata({
        title: tour.title,
        description: tour.description,
        image: tour.image,
        path: `/tours/${slug}`,
    });
}

export default async function TourPage({ params }: PageProps) {
  const { slug } = await params;
  const [tour, relatedTours, faqContent] = await Promise.all([
    getTourBySlug(slug),
    getRelatedTours(slug, 6),
    getFaqContent().catch(() => ({ items: [] })),
  ]);

  const tourFaqs = TOUR_PAGE_FAQ_QUESTIONS.map((question) =>
    faqContent.items.find((item) => item.question === question)
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <JsonLd data={tourJsonLd(tour)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tours", path: "/tours" },
          { name: tour.title, path: `/tours/${slug}` },
        ])}
      />
      <TourHero
        title={tour.title}
        image={tour.image}
        category={tour.category}
        duration={tour.duration}
        price={tour.price}
        pricing={tour.pricing}
      />

      <div className="container mx-auto px-6 pt-20">
        <div className="space-y-16">
          <TourOverview tour={tour} />
          <TourItinerary days={tour.days} slug={tour.slug} />
        </div>
      </div>

      <FaqSection
        label="// before you book"
        title="Good to know"
        bgText="FAQ"
        items={tourFaqs}
        className="border-t border-black/5"
      />

      <TourActionBar
        slug={tour.slug}
        title={tour.title}
        duration={tour.duration}
        price={tour.price}
      />

      {/* Related Tours Section */}
      <TourCarousel tours={relatedTours} currentSlug={slug} />
      <CallToAction packageSlug={tour.slug} />
    </div>
  );
}

