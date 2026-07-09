import {
  getDestinationBySlug,
  getAllDestinations,
  getExperiencesByDestination,
  getHotelsByDestination,
} from "../actions";
import { notFound } from "next/navigation";
import { DestinationHero } from "./components/destination-hero";
import { DestinationOverview } from "./components/destination-overview";
import { DestinationMap } from "./components/destination-map";
import { DestinationExperiences } from "./components/destination-experiences";
import { DestinationFestivals } from "./components/destination-festivals";
import { DestinationHotels } from "./components/destination-hotels";
import { DestinationCarousel } from "./components/destination-carousel";
import CallToAction from "@/components/common/call-to-action";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch critical data
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  // Fetch related data
  const allDestinations = await getAllDestinations();
  const experiences = await getExperiencesByDestination(destination._id, slug);
  const hotels = await getHotelsByDestination(destination._id, slug);

  // Filter festivals (Case insensitive check on category or title)
  const festivals = experiences.filter(
    (exp) =>
      exp.category.toLowerCase().includes("culture") ||
      exp.title.toLowerCase().includes("festival") ||
      exp.slug.includes("festival")
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Banner */}
      <DestinationHero
        name={destination.name}
        image={destination.image}
        region={destination.region}
      />

      {/* Section 1: Destination Description */}
      <DestinationOverview
        name={destination.name}
        description={destination.description}
        slug={destination.slug}
      />

      {/* Section 2: Location on Bhutan map */}
      <DestinationMap
        name={destination.name}
        coordinates={destination.coordinates}
      />

      {/* Section 3: Experience to try in that dzongkhag */}
      <DestinationExperiences
        experiences={experiences}
        destinationName={destination.name}
      />

      {/* Section 4: Popular Festivals */}
      <DestinationFestivals festivals={festivals} />

      {/* Section 5: Where to rest. Hotels */}
      <DestinationHotels hotels={hotels} />

      {/* Section 6: Other Destination Carousel */}
      <DestinationCarousel destinations={allDestinations} currentSlug={slug} />

      {/* Section 7: Call to action */}
      <CallToAction />
    </div>
  );
}
