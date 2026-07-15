"use server";

import { tourRequestDb } from "@/lib/data/tour-requests";
import { RequestStatus } from "./types";
import { revalidatePath } from "next/cache";
import { sendMail, senders } from "@/lib/mail";
import { emailTemplates } from "@/lib/email/templates";

export async function getTourRequests(page = 1, pageSize = 10, status?: RequestStatus | RequestStatus[], search?: string, unread?: boolean) {
    const result = await tourRequestDb.getAllTourRequests(page, pageSize, status, search, unread);
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
        // Fetch first: we need the requester's email + the previous status so we
        // only notify on an actual transition (and reuse it for priority logic).
        const tourRequest = await tourRequestDb.getTourRequestById(id);
        if (!tourRequest) {
            return { success: false, error: "Request not found" };
        }
        const previousStatus = tourRequest.status;

        const success = await tourRequestDb.updateTourRequestStatus(id, status);
        if (!success) {
            return { success: false, error: "Failed to update status" };
        }

        // If the status is APPROVED, increment priorities
        if (status === RequestStatus.APPROVED) {
            try {
                // Handle prepackaged tours
                if (tourRequest.tourId) {
                    const { incrementTourPriority } = await import("@/lib/data/priority-helpers");
                    await incrementTourPriority(tourRequest.tourId);
                }

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
            } catch (error) {
                // Log error but don't fail the approval
                console.error("Failed to increment priorities:", error);
            }
        }

        // Notify the requester when the decision actually changes to approved or
        // rejected. Archive stays silent (internal cleanup). Email failures are
        // logged but don't fail the status update.
        const notify =
            status !== previousStatus &&
            (status === RequestStatus.APPROVED || status === RequestStatus.REJECTED);

        if (notify && tourRequest.email) {
            const isApproved = status === RequestStatus.APPROVED;
            try {
                const mail = await sendMail({
                    to: tourRequest.email,
                    subject: isApproved
                        ? "Your Tour Request is Approved - Bhutan Upward Travels"
                        : "Update on Your Tour Request - Bhutan Upward Travels",
                    html: isApproved
                        ? emailTemplates.requestApproved(tourRequest)
                        : emailTemplates.requestRejected(tourRequest),
                    from: isApproved ? senders.approved() : senders.rejected(),
                    // reservations@/support@ may not be monitored inboxes yet —
                    // route replies to the operator.
                    replyTo: process.env.OPERATOR_EMAIL || undefined,
                });
                if (!mail.success) {
                    console.error(`Failed to send ${status} email:`, mail.error);
                }
            } catch (err) {
                console.error(`Error sending ${status} email:`, err);
            }
        }

        // Acting on a request (approve/reject/archive) counts as reading it.
        try {
            await tourRequestDb.markRead(id);
        } catch (err) {
            console.error("Failed to mark request read:", err);
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

// ---- Notification bell -----------------------------------------------------

export async function getTourRequestNotifications(limit = 10) {
    try {
        const [unreadCount, recent] = await Promise.all([
            tourRequestDb.getUnreadCount(),
            tourRequestDb.getRecentRequests(limit),
        ]);
        return { unreadCount, recent };
    } catch (error) {
        console.error("Failed to load notifications:", error);
        return { unreadCount: 0, recent: [] };
    }
}

export async function markTourRequestRead(id: string) {
    try {
        await tourRequestDb.markRead(id);
        revalidatePath("/admin/tour-requests");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function markAllTourRequestsRead() {
    try {
        await tourRequestDb.markAllRead();
        revalidatePath("/admin/tour-requests");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function markTourRequestUnread(id: string) {
    try {
        await tourRequestDb.markUnread(id);
        revalidatePath("/admin/tour-requests");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
