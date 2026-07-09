import { getDestinationById } from "@/lib/data/destinations";
import { getExperiencesByDestination } from "@/lib/data/experiences";
import { getHotelsByDestination } from "@/lib/data/hotels";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationHero } from "@/app/(website)/destinations/[slug]/components/destination-hero";
import { DestinationOverview } from "@/app/(website)/destinations/[slug]/components/destination-overview";
import { DestinationMap } from "@/app/(website)/destinations/[slug]/components/destination-map";
import { DestinationExperiences } from "@/app/(website)/destinations/[slug]/components/destination-experiences";
import { DestinationFestivals } from "@/app/(website)/destinations/[slug]/components/destination-festivals";
import { DestinationHotels } from "@/app/(website)/destinations/[slug]/components/destination-hotels";

interface PageProps {
  params: { id: string };
}

// Destination View Page - Admin
export default async function DestinationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    redirect("/admin/destinations/new/edit");
  }

  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  // Fetch related data
  const experiences = await getExperiencesByDestination(destination.slug);
  const hotels = await getHotelsByDestination(destination.slug);

  // Filter festivals
  const festivals = experiences.filter(
    (exp) =>
      exp.category.toLowerCase().includes("culture") ||
      exp.title.toLowerCase().includes("festival") ||
      exp.slug.includes("festival")
  );

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Fixed Edit Button */}
      <Link
        href={`/admin/destinations/${id}/edit`}
        className="fixed top-24 right-8 z-50"
      >
        <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
          <Pencil className="w-5 h-5" />
        </Button>
      </Link>

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
    </div>
  );
}
