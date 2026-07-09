"use client";

import { LocationMap } from "@/components/common/location-map";
import { Experience } from "../../schema";

interface ExperienceMapProps {
    name: string;
    coordinates?: [number, number] | null;
}

export function ExperienceMap({ name, coordinates }: ExperienceMapProps) {
    if (!coordinates) return null;

    return (
        <LocationMap
            name={name}
            coordinates={coordinates!}
            title="Experience Location"
            subtitle="// precise coordinates"
        />
    );
}
