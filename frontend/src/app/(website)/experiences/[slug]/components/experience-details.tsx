"use client";

import React from "react";
import { ExperienceOverview } from "./experience-overview";

import { ReservationCard } from "@/components/common/reservation-card";

interface ExperienceDetailsProps {
    experience: {
        title: string;
        description: string;
        slug: string;
        highlights?: string[];
    };
}

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            {/* Essence / Overview Section */}
            <div className="lg:col-span-8">
                <ExperienceOverview
                    title={experience.title}
                    description={experience.description}
                    highlights={experience.highlights}
                />
            </div>

            {/* Sidebar / Booking Card */}
            <ReservationCard slug={experience.slug} className="lg:col-span-4" />
        </div>
    );
}
