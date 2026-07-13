import { TourRequest } from "@/app/admin/tour-requests/types";
import { escapeHtml } from "@/lib/utils";

export const emailTemplates = {
    userConfirmation: (data: TourRequest) => `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1a1a1a;">Tashi Delek, ${escapeHtml(data.firstName)}!</h2>
            <p>Thank you for choosing <strong>Bhutan Upward Travels</strong> to plan your journey. We have received your tour request and our team is already working on it.</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Request Summary:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Destination:</strong> ${escapeHtml(data.destination || "Not specified")}</li>
                    <li><strong>Travel Date:</strong> ${escapeHtml(data.travelDate)}</li>
                    <li><strong>Travelers:</strong> ${escapeHtml(data.travelers)}</li>
                </ul>
            </div>

            <p>One of our travel specialists will reach out to you shortly at <strong>${escapeHtml(data.email)}</strong> to discuss your itinerary in detail.</p>

            <p>Warm regards,<br>The Bhutan Upward Travels Team</p>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2025 Bhutan Upward Travels. All rights reserved.</p>
        </div>
    `,

    operatorNotification: (data: TourRequest) => `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d32f2f;">New Tour Request Received</h2>
            <p>A new trip request has been submitted through the website.</p>

            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Customer Details:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</li>
                    <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
                    <li><strong>Phone:</strong> ${escapeHtml(data.phone)}</li>
                </ul>
            </div>

            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Trip Preferences:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Destination:</strong> ${escapeHtml(data.destination || "Not specified")}</li>
                    <li><strong>Travel Date:</strong> ${escapeHtml(data.travelDate)}</li>
                    <li><strong>Travelers:</strong> ${escapeHtml(data.travelers)}</li>
                    <li><strong>Package:</strong> ${escapeHtml(data.tourName || "Custom Trip")}</li>
                </ul>
            </div>

            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Message:</h3>
                <p>${escapeHtml(data.message || "No message provided.")}</p>
            </div>

            <p style="font-size: 14px; color: #555;">Please log in to the admin dashboard to manage this request.</p>
        </div>
    `,
};
