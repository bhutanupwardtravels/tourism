import { notFound } from "next/navigation";
import { TourHero } from "./components/tour-hero";
import { TourCarousel } from "./components/tour-carousel";
import { TourItinerary } from "./components/tour-itenary";
import { TourOverview } from "./components/tour-overview";
import { getTourBySlug, getRelatedTours } from "../actions";
import CallToAction from "@/components/common/call-to-action";
import { TourBookingCard } from "./components/tour-booking-card";
import { JsonLd } from "@/components/common/json-ld";
import { tourJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

import type { Metadata } from "next";
import { listSlugs } from "@/lib/data/slugs";
import { buildMetadata } from "@/lib/site";

export async function generateStaticParams() {
    const slugs = await listSlugs("tours");
    return slugs.map((slug) => ({ slug }));
}

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
  const [tour, relatedTours] = await Promise.all([
    getTourBySlug(slug),
    getRelatedTours(slug, 6)
  ]);

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
      />

      <div className="container mx-auto px-6 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <TourOverview tour={tour} />
          <TourBookingCard slug={tour.slug} />
        </div>

        <TourItinerary days={tour.days} slug={tour.slug} />
      </div>

      {/* Related Tours Section */}
      <TourCarousel tours={relatedTours} currentSlug={slug} />
      <CallToAction />
    </div>
  );
}

