import { TourRequest } from "@/app/admin/tour-requests/types";
import { escapeHtml } from "@/lib/utils";
import { siteUrl } from "@/lib/site";

const FONT_STACK =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const AMBER = "#d97706";

function logoUrl(): string {
    return `${siteUrl()}/images/logo.png`;
}

function emailHeader(): string {
    return `
        <div style="background-color: #000000; padding: 36px 20px; text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                    <td style="width: 56px; height: 56px; background-color: #ffffff; border-radius: 9999px; text-align: center; vertical-align: middle;">
                        <img src="${logoUrl()}" alt="Bhutan Upward Travels" width="38" height="38" style="display: block; margin: 9px auto; object-fit: contain;" />
                    </td>
                </tr>
            </table>
            <div style="margin-top: 16px; font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #ffffff; text-transform: uppercase;">
                Bhutan Upward
            </div>
            <div style="font-size: 10px; letter-spacing: 5px; color: #9ca3af; text-transform: uppercase; margin-top: 2px;">
                Travels
            </div>
        </div>
    `;
}

function emailFooter(): string {
    return `
        <div style="background-color: #000000; padding: 24px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0; font-size: 11px; letter-spacing: 1px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Bhutan Upward Travels. All rights reserved.
            </p>
        </div>
    `;
}

function detailsBox(title: string, rows: { label: string; value: string }[]): string {
    return `
        <div style="background-color: #f7f7f5; border-left: 3px solid ${AMBER}; padding: 20px 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #78716c;">${escapeHtml(title)}</h3>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #1a1a1a;">
                ${rows
                    .map(
                        (r) => `
                <tr>
                    <td style="padding: 4px 0; color: #78716c; width: 40%; vertical-align: top;">${escapeHtml(r.label)}</td>
                    <td style="padding: 4px 0; font-weight: 600;">${escapeHtml(r.value)}</td>
                </tr>`
                    )
                    .join("")}
            </table>
        </div>
    `;
}

function ctaButton(label: string, href: string): string {
    return `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
            <tr>
                <td style="background-color: ${AMBER}; padding: 0;">
                    <a href="${href}" style="display: inline-block; padding: 14px 28px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; text-decoration: none;">${escapeHtml(label)}</a>
                </td>
            </tr>
        </table>
    `;
}

function wrapper(bodyHtml: string): string {
    return `
        <div style="font-family: ${FONT_STACK}; background-color: #f4f4f4; padding: 32px 16px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eee;">
                ${emailHeader()}
                <div style="padding: 40px 32px; line-height: 1.6; color: #333333;">
                    ${bodyHtml}
                </div>
                ${emailFooter()}
            </div>
        </div>
    `;
}

export const emailTemplates = {
    userConfirmation: (data: TourRequest) =>
        wrapper(`
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #1a1a1a;">Tashi Delek, ${escapeHtml(data.firstName)}!</h2>
            <p>Thank you for choosing <strong>Bhutan Upward Travels</strong> to plan your journey. We have received your tour request and our team is already working on it.</p>

            ${detailsBox("Request Summary", [
                { label: "Destination", value: data.destination || "Not specified" },
                { label: "Travel Date", value: data.travelDate },
                { label: "Travelers", value: data.travelers },
            ])}

            <p>One of our travel specialists will reach out to you shortly at <strong>${escapeHtml(data.email)}</strong> to discuss your itinerary in detail.</p>

            <p style="margin-top: 32px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),

    operatorNotification: (data: TourRequest) =>
        wrapper(`
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px;">New Tour Request Received</h2>
            <p>A new trip request has been submitted through the website.</p>

            ${detailsBox("Customer Details", [
                { label: "Name", value: `${data.firstName} ${data.lastName}` },
                { label: "Email", value: data.email },
                { label: "Phone", value: data.phone },
            ])}

            ${detailsBox("Trip Preferences", [
                { label: "Destination", value: data.destination || "Not specified" },
                { label: "Travel Date", value: data.travelDate },
                { label: "Travelers", value: data.travelers },
                { label: "Package", value: data.tourName || "Custom Trip" },
            ])}

            <div style="background-color: #f7f7f5; padding: 20px 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #78716c;">Message</h3>
                <p style="margin: 0; font-size: 14px;">${escapeHtml(data.message || "No message provided.")}</p>
            </div>

            ${
                data._id
                    ? ctaButton("View in Admin Dashboard", `${siteUrl()}/admin/tour-requests/${data._id}`)
                    : ""
            }
        `),

    requestApproved: (data: TourRequest) =>
        wrapper(`
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #1a1a1a;">Great news, ${escapeHtml(data.firstName)}! &#127881;</h2>
            <p>Your tour request with <strong>Bhutan Upward Travels</strong> has been <strong style="color: ${AMBER};">approved</strong>. We're delighted to help bring your journey to life.</p>

            ${detailsBox("Your Request", [
                { label: "Trip", value: data.tourName || "Custom Trip" },
                { label: "Destination", value: data.destination || "Not specified" },
                { label: "Travel Date", value: data.travelDate },
                { label: "Travelers", value: data.travelers },
            ])}

            <p>One of our travel specialists will be in touch shortly to finalise the details and next steps. If you have any questions in the meantime, simply reply to this email.</p>

            <p style="margin-top: 32px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),

    requestRejected: (data: TourRequest) =>
        wrapper(`
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #1a1a1a;">Update on your tour request</h2>
            <p>Dear ${escapeHtml(data.firstName)},</p>
            <p>Thank you for your interest in travelling with <strong>Bhutan Upward Travels</strong>. After reviewing your request, we're sorry to say we're unable to proceed with it at this time.</p>

            ${detailsBox("Request Reference", [
                { label: "Trip", value: data.tourName || "Custom Trip" },
                { label: "Destination", value: data.destination || "Not specified" },
                { label: "Travel Date", value: data.travelDate },
            ])}

            <p>This may be due to availability, timing, or other constraints. We'd genuinely love to help you explore Bhutan another time.</p>

            ${ctaButton("Submit a New Request", `${siteUrl()}/plan-my-trip`)}

            <p style="margin-top: 8px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),
};
