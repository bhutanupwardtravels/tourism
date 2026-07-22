import { siteUrl, SITE_NAME } from "@/lib/site";
import type { ContactContent } from "@/lib/data/contact";

function abs(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${siteUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function organizationJsonLd(contact: ContactContent | null) {
    const sameAs = contact
        ? Object.values(contact.socials).filter((url) => Boolean(url))
        : [];

    return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: SITE_NAME,
        url: siteUrl(),
        logo: abs("/images/logo.png"),
        image: abs("/images/logo.png"),
        ...(contact?.email ? { email: contact.email } : {}),
        ...(contact?.phone ? { telephone: contact.phone } : {}),
        ...(contact?.address ? { address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "BT" } } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl(),
    };
}

interface CollectionItemLike {
    name: string;
    path: string;
    image?: string;
}

export function collectionPageJsonLd(params: {
    name: string;
    description: string;
    path: string;
    items: CollectionItemLike[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: params.name,
        description: params.description,
        url: abs(params.path),
        mainEntity: {
            "@type": "ItemList",
            itemListElement: params.items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: abs(item.path),
                ...(item.image ? { image: abs(item.image) } : {}),
            })),
        },
    };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: abs(item.path),
        })),
    };
}

interface TourDayLike {
    day: number;
    title: string;
    description: string;
}

interface TourLike {
    slug: string;
    title: string;
    description: string;
    image: string;
    duration: string;
    price: number;
    category?: string;
    days: TourDayLike[];
}

export function tourJsonLd(tour: TourLike) {
    const url = abs(`/tours/${tour.slug}`);
    return {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tour.title,
        description: tour.description,
        image: abs(tour.image),
        url,
        ...(tour.category ? { touristType: tour.category } : {}),
        itinerary: {
            "@type": "ItemList",
            itemListElement: [...tour.days]
                .sort((a, b) => a.day - b.day)
                .map((day) => ({
                    "@type": "ListItem",
                    position: day.day,
                    name: day.title,
                    description: day.description,
                })),
        },
        offers: {
            "@type": "Offer",
            price: tour.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url,
        },
    };
}

interface DestinationLike {
    slug: string;
    name: string;
    description: string;
    image: string;
    region: string;
    coordinates: [number, number];
}

export function destinationJsonLd(destination: DestinationLike) {
    return {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: destination.name,
        description: destination.description,
        image: abs(destination.image),
        url: abs(`/destinations/${destination.slug}`),
        containedInPlace: {
            "@type": "AdministrativeArea",
            name: destination.region,
            containedInPlace: { "@type": "Country", name: "Bhutan" },
        },
        ...(destination.coordinates
            ? {
                  geo: {
                      "@type": "GeoCoordinates",
                      latitude: destination.coordinates[0],
                      longitude: destination.coordinates[1],
                  },
              }
            : {}),
    };
}

interface HotelLike {
    slug?: string;
    name: string;
    description: string;
    image: string;
    location?: string;
    rating: number;
    priceRange: string;
    amenities?: string[];
    coordinates?: [number, number];
}

export function hotelJsonLd(hotel: HotelLike & { slug: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: hotel.name,
        description: hotel.description,
        image: abs(hotel.image),
        url: abs(`/hotels/${hotel.slug}`),
        priceRange: hotel.priceRange,
        starRating: { "@type": "Rating", ratingValue: hotel.rating },
        ...(hotel.location
            ? { address: { "@type": "PostalAddress", addressLocality: hotel.location, addressCountry: "BT" } }
            : {}),
        ...(hotel.coordinates
            ? {
                  geo: {
                      "@type": "GeoCoordinates",
                      latitude: hotel.coordinates[0],
                      longitude: hotel.coordinates[1],
                  },
              }
            : {}),
        ...(hotel.amenities && hotel.amenities.length > 0
            ? {
                  amenityFeature: hotel.amenities.map((amenity) => ({
                      "@type": "LocationFeatureSpecification",
                      name: amenity,
                  })),
              }
            : {}),
    };
}

interface ExperienceLike {
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    duration?: string;
    coordinates?: [number, number] | null;
}

export function experienceJsonLd(experience: ExperienceLike) {
    return {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        name: experience.title,
        description: experience.description,
        image: abs(experience.image),
        url: abs(`/experiences/${experience.slug}`),
        touristType: experience.category,
        ...(experience.coordinates
            ? {
                  geo: {
                      "@type": "GeoCoordinates",
                      latitude: experience.coordinates[0],
                      longitude: experience.coordinates[1],
                  },
              }
            : {}),
    };
}
