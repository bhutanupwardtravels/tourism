"use server";

import { tourRequestDb } from "@/lib/data/tour-requests";
import { RequestStatus } from "./types";
import { revalidatePath } from "next/cache";

export async function getTourRequests(page = 1, pageSize = 10, status?: RequestStatus | RequestStatus[], search?: string) {
    const result = await tourRequestDb.getAllTourRequests(page, pageSize, status, search);
    return {
        items: result.items,
        page: result.page,
        page_size: result.limit,
        total_pages: result.totalPages,
        total_items: result.total,
    };
}

export async function updateTourRequestStatus(id: string, status: RequestStatus) {
    try {
        // First, update the status
        const success = await tourRequestDb.updateTourRequestStatus(id, status);
        if (!success) {
            return { success: false, error: "Failed to update status" };
        }

        // If the status is APPROVED, increment priorities
        if (status === RequestStatus.APPROVED) {
            try {
                // Fetch the tour request to get its details
                const tourRequest = await tourRequestDb.getTourRequestById(id);

                if (tourRequest) {
                    // Handle prepackaged tours
                    if (tourRequest.tourId) {
                        const { incrementTourPriority } = await import("@/lib/data/priority-helpers");
                        await incrementTourPriority(tourRequest.tourId);
                    }

                    // Handle custom trips - extract unique IDs from itinerary
                    // Handle custom trips - extract unique IDs from itinerary
                    if (tourRequest.customItinerary && tourRequest.customItinerary.length > 0) {
                        const experienceIds: string[] = [];
                        const destinationIds: string[] = [];
                        const hotelIds: string[] = [];

                        // Extract all IDs from the custom itinerary
                        tourRequest.customItinerary.forEach(day => {
                            day.items.forEach(item => {
                                if (item.experienceId) {
                                    experienceIds.push(item.experienceId);
                                }
                                // Handle new destinationFromId and destinationToId fields
                                if (item.destinationFromId) {
                                    destinationIds.push(item.destinationFromId);
                                }
                                if (item.destinationToId) {
                                    destinationIds.push(item.destinationToId);
                                }
                                // Also handle legacy destinationId field
                                if (item.destinationId) {
                                    destinationIds.push(item.destinationId);
                                }
                                if (item.hotelId) {
                                    hotelIds.push(item.hotelId);
                                }
                            });
                        });

                        // Increment priorities for all unique items
                        const { incrementMultiplePriorities } = await import("@/lib/data/priority-helpers");
                        await incrementMultiplePriorities(experienceIds, destinationIds, hotelIds);
                    }
                }
            } catch (error) {
                // Log error but don't fail the approval
                console.error("Failed to increment priorities:", error);
            }
        }

        revalidatePath("/admin/tour-requests");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Internal server error" };
    }
}

export async function deleteTourRequest(id: string) {
    try {
        const success = await tourRequestDb.deleteTourRequest(id);
        if (success) {
            revalidatePath("/admin/tour-requests");
            return { success: true };
        }
        return { success: false, error: "Failed to delete request" };
    } catch (error) {
        return { success: false, error: "Internal server error" };
    }
}

export async function getTourRequestById(id: string) {
    try {
        const data = await tourRequestDb.getTourRequestById(id);
        return data;
    } catch (error) {
        return null;
    }
}
