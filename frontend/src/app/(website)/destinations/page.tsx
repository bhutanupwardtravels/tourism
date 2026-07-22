import { getDestinations } from "./actions";
import { Destination } from "./schema";
import { DestinationsGrid } from "./components/destinations-grid";
import { PageHeader } from "@/components/common/page-header";
import { JsonLd } from "@/components/common/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Bhutan Travel Destinations by Region",
    description:
        "Explore Bhutan's 20 dzongkhags — from Paro's Tiger's Nest and the Thimphu valley to the remote alpine reaches of Haa, Gasa, and Lhuentse. Find your region and start planning.",
    path: "/destinations",
});

export default async function DestinationsPage() {
    const destinations = (await getDestinations()) as Destination[];

    return (
        <div className="min-h-screen bg-white text-black pb-24 overflow-hidden">
            <JsonLd
                data={collectionPageJsonLd({
                    name: "Bhutan Travel Destinations",
                    description: "Bhutan's dzongkhags and regions, mapped for travel planning.",
                    path: "/destinations",
                    items: destinations.map((destination) => ({
                        name: destination.name,
                        path: `/destinations/${destination.slug}`,
                        image: destination.image,
                    })),
                })}
            />
            <PageHeader
                label="// explore regions"
                title="Our Destinations"
                description="Mapping the diverse landscapes of Bhutan. From the high alpine valleys of the north to the lush subtropical plains of the south."
                bgText="Regions"
            />

            <div className="container mx-auto px-6">
                <DestinationsGrid destinations={destinations} />
            </div>
        </div>
    );
}
