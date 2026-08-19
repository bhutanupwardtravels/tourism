"use client";

import { DestinationCard } from "@/components/common/destination-card";
import { Destination } from "../schema";
import { Reveal } from "@/components/ui/reveal";

interface DestinationsGridProps {
    destinations: Destination[];
}

export function DestinationsGrid({ destinations }: DestinationsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
            <h2 className="sr-only">Destinations</h2>
            {destinations.map((dest, index) => (
                <Reveal y={40} duration={0.8}
                    key={dest.slug}>
                    <DestinationCard destination={dest} index={index} />
                </Reveal>
            ))}
        </div>
    );
}
