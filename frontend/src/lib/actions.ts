"use server";

import { destinations, experiences, Destination, Experience } from "./data";

export async function getDestinations(): Promise<Destination[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return destinations;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return destinations.find((d) => d.slug === slug);
}

export async function getExperiences(): Promise<Experience[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return experiences;
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return experiences.find((e) => e.slug === slug);
}

// Trip Request Actions

import { tripRequests, TripRequest } from "./data";

export async function getTripRequests(): Promise<TripRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Sort by createdAt desc
    return [...tripRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getTripRequestById(id: string): Promise<TripRequest | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return tripRequests.find(tr => tr.id === id);
}

export async function updateTripRequestStatus(id: string, status: TripRequest["status"], feedback?: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const request = tripRequests.find(tr => tr.id === id);
    if (request) {
        request.status = status;
        if (feedback) {
            request.adminFeedback = feedback;
        }
    }
}

export async function updateTripRequestProposal(id: string, proposal: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const request = tripRequests.find(tr => tr.id === id);
    if (request) {
        request.adminProposal = proposal;
        request.status = "Proposed"; // Automatically change status to Proposed
    }
}
