"use client";

import React from "react";
import { Experience } from "@/app/admin/experiences/schema";
import { VisualGallery } from "@/components/common/visual-gallery";

interface ExperienceGalleryProps {
  experience: Experience;
}

export function ExperienceGallery({ experience }: ExperienceGalleryProps) {
  const images = experience.gallery || [];
  if (!images || images.length === 0) return null;

  return (
    <VisualGallery
      images={images}
      title="The Visual Experience"
      subtitle={`// journey: ${experience.category}`}
    />
  );
}
