import { Suspense } from "react";
import { getPlanMyTripData } from "./actions";
import PlanMyTripClient from "./components/plan-my-trip-client";

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
