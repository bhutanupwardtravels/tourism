"use server";

import * as tourDb from "@/lib/data/tours";
import * as experienceDb from "@/lib/data/experiences";
import * as destinationDb from "@/lib/data/destinations";
import { tourRequestDb } from "@/lib/data/tour-requests";
import { RequestStatus } from "@/app/admin/tour-requests/types";

export async function getDashboardData() {
    try {
        // Fetch counts from MongoDB
        const toursData = await tourDb.listTours(1, 1);
        const experiencesData = await experienceDb.listExperiences(1, 1);
        const destinationsData = await destinationDb.listDestinations(1, 1);

        // Fetch tour requests (limit to 5 for recent activity)
        const tourRequestsData = await tourRequestDb.getAllTourRequests(1, 5);

        // Fetch pending requests specifically for the dashboard
        const pendingRequestsData = await tourRequestDb.getAllTourRequests(1, 1, RequestStatus.PENDING);

        // Recent Activity
        const recentActivity = tourRequestsData.items.map(tr => ({
            id: tr._id,
            userName: `${tr.firstName} ${tr.lastName}`, // Mapping to 'userName' for dashboard compatibility
            userEmail: tr.email,
            type: "Tour Request", // Static type for now
            status: tr.status,
            createdAt: tr.createdAt,
            packageName: tr.tourName || "General Enquiry"
        }));

        // Calculate estimated revenue (approx $2,800 per booking as a placeholder average)
        const estimatedRevenue = tourRequestsData.total * 2800;
        const formattedRevenue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: "compact",
            compactDisplay: "short"
        }).format(estimatedRevenue);

        return {
            stats: {
                totalBookings: tourRequestsData.total,
                activeTours: toursData.total_items,
                totalExperiences: experiencesData.total_items,
                totalDestinations: destinationsData.total_items,
                revenue: formattedRevenue,
                pendingRequests: pendingRequestsData.total
            },
            recentActivity
        };
    } catch (error) {
        throw new Error("Failed to fetch dashboard data");
    }
}
