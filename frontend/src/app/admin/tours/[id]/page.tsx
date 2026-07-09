import { getTourById, getRelatedTours } from "@/app/admin/tours/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourHero } from "@/app/(website)/tours/[slug]/components/tour-hero";
import { TourOverview } from "@/app/(website)/tours/[slug]/components/tour-overview";
import { TourBookingCard } from "@/app/(website)/tours/[slug]/components/tour-booking-card";
import { TourItinerary } from "@/app/(website)/tours/[slug]/components/tour-itenary";
import { TourCarousel } from "@/app/(website)/tours/[slug]/components/tour-carousel";
import { Tour as WebsiteTour, TourDay as WebsiteTourDay } from "@/app/(website)/tours/schema";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminTourViewPage({ params }: PageProps) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    const relatedTours = await getRelatedTours(tour.slug);

    // Cast admin data to website types for display components
    // The data structure should be compatible enough for display purposes
    const displayTour = tour as unknown as WebsiteTour;
    const displayRelatedTours = relatedTours as unknown as WebsiteTour[];
    const displayDays = tour.days as unknown as WebsiteTourDay[];

    return (
        <div className="min-h-screen bg-white text-black relative">
            {/* Fixed Edit Button */}
            <Link
                href={`/admin/tours/${id}/edit`}
                className="fixed top-24 right-8 z-50"
            >
                <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                    <Pencil className="w-5 h-5" />
                </Button>
            </Link>

            <TourHero
                title={tour.title}
                image={tour.image}
                category={tour.category}
                duration={tour.duration}
                price={tour.price}
            />

            <div className="container mx-auto px-6 py-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-40">
                    <TourOverview tour={displayTour} />
                    {/* Admin doesn't need to book, but visually we keep the layout consistent */}
                    <TourBookingCard slug={tour.slug} />
                </div>

                <TourItinerary days={displayDays} slug={tour.slug} />
            </div>

            {/* Related Tours Section */}
            <TourCarousel tours={displayRelatedTours} currentSlug={tour.slug} />
        </div>
    );
}
