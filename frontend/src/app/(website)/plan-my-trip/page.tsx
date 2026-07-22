import { Suspense } from "react";
import { getPlanMyTripData } from "./actions";
import PlanMyTripClient from "./components/plan-my-trip-client";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: "Plan My Trip",
    description:
        "Build a custom Bhutan itinerary or choose from curated packages — design your journey with our specialists in a few guided steps.",
    path: "/plan-my-trip",
});

export default async function PlanMyTripPage() {
    const data = await getPlanMyTripData();

    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <PlanMyTripClient
                packages={data.packages}
                destinations={data.destinations}
                allDestinations={data.allDestinations}
                experiences={data.experiences}
                hotels={data.hotels}
                costs={data.costs}
            />
        </Suspense>
    );
}
