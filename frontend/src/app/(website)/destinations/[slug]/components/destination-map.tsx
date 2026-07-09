"use client";

import { LocationMap } from "@/components/common/location-map";

interface DestinationMapProps {
  name: string;
  coordinates: [number, number];
}

export function DestinationMap({ name, coordinates }: DestinationMapProps) {
  return (
    <LocationMap
      name={name}
      coordinates={coordinates}
      title="Map Location"
      subtitle="// location details"
    />
  );
}
