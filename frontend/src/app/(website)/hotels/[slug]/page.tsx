import { getHotelBySlug, getRelatedHotels } from "../actions";
import { notFound } from "next/navigation";
import { HotelHero } from "./components/hotel-hero";
import { HotelOverview } from "./components/hotel-overview";
import { VisualGallery } from "@/components/common/visual-gallery";
import { LocationMap } from "@/components/common/location-map";
import { RelatedHotels } from "./components/related-hotels";
import CallToAction from "@/components/common/call-to-action";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function HotelPage({ params }: PageProps) {
    const { slug } = await params;
    const hotel = await getHotelBySlug(slug);

    if (!hotel) {
        notFound();
    }

    const relatedHotels = await getRelatedHotels(hotel.destination || hotel.destinationSlug || "", hotel.id);

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <HotelHero
                name={hotel.name}
                image={hotel.image}
                location={hotel.location}
                rating={hotel.rating}
                priceRange={hotel.priceRange}
            />

            <HotelOverview
                description={hotel.description}
                amenities={hotel.amenities}
                rooms={hotel.rooms}
            />

            {/* Gallery Section */}
            <VisualGallery
                images={hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image]}
                title="Interior & Soul"
                subtitle="// architectural narrative"
            />

            {/* Map Section */}
            {hotel.coordinates && (
                <LocationMap
                    name={hotel.name}
                    coordinates={hotel.coordinates as [number, number]}
                    title="Sanctuary Location"
                    subtitle="// geographical coordinates"
                />
            )}

            <RelatedHotels hotels={relatedHotels} />

            <CallToAction />
        </div>
    );
}
