import { getHotelBySlug, getRelatedHotels } from "../actions";
import { getExperiencesByDestination } from "@/app/(website)/destinations/actions";
import { notFound } from "next/navigation";
import { HotelHero } from "./components/hotel-hero";
import { HotelOverview } from "./components/hotel-overview";
import { VisualGallery } from "@/components/common/visual-gallery";
import { LocationMap } from "@/components/common/location-map";
import { LocalExperiences } from "@/components/common/local-experiences";
import { RelatedHotels } from "./components/related-hotels";
import CallToAction from "@/components/common/call-to-action";
import { JsonLd } from "@/components/common/json-ld";
import { hotelJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

import type { Metadata } from "next";
import { listSlugs } from "@/lib/data/slugs";
import { buildMetadata } from "@/lib/site";

export async function generateStaticParams() {
    const slugs = await listSlugs("hotels");
    return slugs.map((slug) => ({ slug }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const hotel = await getHotelBySlug(slug);
    if (!hotel) return {};
    return buildMetadata({
        title: hotel.name,
        description: hotel.description,
        image: hotel.image,
        path: `/hotels/${slug}`,
    });
}

export default async function HotelPage({ params }: PageProps) {
    const { slug } = await params;
    const hotel = await getHotelBySlug(slug);

    if (!hotel) {
        notFound();
    }

    // The valley the property stands in, however the row happens to record it.
    const destinationRef = hotel.destination || hotel.destinationSlug || "";
    const destinationName = hotel.resolvedDestinationName || hotel.location;

    const [relatedHotels, localExperiences] = await Promise.all([
        getRelatedHotels(destinationRef, hotel.id),
        getExperiencesByDestination(hotel.destinationId, hotel.resolvedDestinationSlug || hotel.destinationSlug),
    ]);

    return (
        <div className="min-h-screen bg-white text-black">
            <JsonLd data={hotelJsonLd(hotel)} />
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Hotels", path: "/hotels" },
                    { name: hotel.name, path: `/hotels/${slug}` },
                ])}
            />
            <HotelHero
                name={hotel.name}
                image={hotel.image}
                location={hotel.location}
                rating={hotel.rating}
                priceRange={hotel.priceRange}
                rooms={hotel.rooms}
                price={hotel.price}
            />

            <HotelOverview
                slug={slug}
                description={hotel.description}
                amenities={hotel.amenities}
                rooms={hotel.rooms}
            />

            {/* Gallery Section */}
            <VisualGallery
                images={hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image]}
                title="Interior & Soul"
                subtitle="// architectural narrative"
                imageAlt={hotel.name}
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

            {/* What there is to do around the property, before the page moves on
                to other places to sleep. */}
            {destinationName && (
                <LocalExperiences
                    experiences={localExperiences}
                    placeName={destinationName}
                    label={`// around ${destinationName.toLowerCase()}`}
                    title="Nearby"
                    titleAccent="experiences"
                />
            )}

            <RelatedHotels hotels={relatedHotels} />

            <CallToAction />
        </div>
    );
}
