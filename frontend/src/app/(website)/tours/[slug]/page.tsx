import { notFound } from "next/navigation";
import { TourHero } from "./components/tour-hero";
import { TourCarousel } from "./components/tour-carousel";
import { TourItinerary } from "./components/tour-itenary";
import { TourOverview } from "./components/tour-overview";
import { getTourBySlug, getAllTours } from "../actions";
import CallToAction from "@/components/common/call-to-action";
import { TourBookingCard } from "./components/tour-booking-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourPage({ params }: PageProps) {
  const { slug } = await params;
  const [tour, allTours] = await Promise.all([
    getTourBySlug(slug),
    getAllTours()
  ]);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black">
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
      <TourCarousel tours={allTours} currentSlug={slug} />
      <CallToAction />
    </div>
  );
}

