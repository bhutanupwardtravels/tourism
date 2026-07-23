import { TourRequest } from "@/app/admin/tour-requests/types";
import { escapeHtml } from "@/lib/utils";
import { siteUrl } from "@/lib/site";

const SANS_STACK =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF_STACK = "Georgia, 'Times New Roman', Times, serif";
const MONO_STACK =
    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
const AMBER = "#d97706";
const AMBER_SOFT = "#f59e0b";

function logoUrl(): string {
    return `${siteUrl()}/images/logo.png`;
}

/** A word (or phrase) rendered like the homepage's italic serif amber accents. */
function accent(text: string): string {
    return `<span style="font-family: ${SERIF_STACK}; font-style: italic; color: ${AMBER};">${escapeHtml(text)}</span>`;
}

/** Mono, uppercase, wide-tracked "// label" — mirrors the site's section eyebrows. */
function eyebrow(text: string): string {
    return `
        <div style="font-family: ${MONO_STACK}; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${AMBER}; margin: 0 0 14px;">
            // ${escapeHtml(text)}
        </div>
    `;
}

/** Light-weight, tight-tracked heading; `headingHtml` may embed accent() spans. */
function heading(headingHtml: string): string {
    return `
        <h2 style="margin: 0 0 16px; font-family: ${SANS_STACK}; font-weight: 300; letter-spacing: -0.02em; font-size: 28px; line-height: 1.25; color: #1a1a1a;">
            ${headingHtml}
        </h2>
    `;
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
        <div style="height: 2px; line-height: 2px; font-size: 0; background-color: #f4f4f4; background-image: linear-gradient(to right, transparent, ${AMBER_SOFT}, transparent);">&nbsp;</div>
    `;
}

function emailFooter(): string {
    return `
        <div style="background-color: #000000; padding: 24px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0; font-family: ${MONO_STACK}; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Bhutan Upward Travels. All rights reserved.
            </p>
        </div>
    `;
}

function detailsBox(title: string, rows: { label: string; value: string }[]): string {
    return `
        <div style="background-color: #f7f7f5; border-left: 3px solid ${AMBER}; padding: 20px 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; font-family: ${MONO_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #78716c;">${escapeHtml(title)}</h3>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family: ${SANS_STACK}; font-size: 14px; color: #1a1a1a;">
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

/** Shows the destination if the requester named one, otherwise the chosen package/tour — never both, never blank. */
function tripSummary(data: TourRequest): { label: string; value: string } {
    if (data.destination) return { label: "Destination", value: data.destination };
    if (data.tourName) return { label: "Package", value: data.tourName };
    return { label: "Destination", value: "Not specified" };
}

function ctaButton(label: string, href: string): string {
    return `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
            <tr>
                <td style="background-color: ${AMBER}; padding: 0;">
                    <a href="${href}" style="display: inline-block; padding: 14px 28px; font-family: ${MONO_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; text-decoration: none;">${escapeHtml(label)}</a>
                </td>
            </tr>
        </table>
    `;
}

function wrapper(bodyHtml: string): string {
    return `
        <div style="font-family: ${SANS_STACK}; background-color: #ffffff;">
            ${emailHeader()}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; background-image: radial-gradient(circle at 50% 0%, rgba(217,119,6,0.06), transparent 60%);">
                <tr>
                    <td align="center" style="padding: 40px 16px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                            <tr>
                                <td style="line-height: 1.6; color: #333333; font-family: ${SANS_STACK};">
                                    ${bodyHtml}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            ${emailFooter()}
        </div>
    `;
}

export const emailTemplates = {
    userConfirmation: (data: TourRequest) =>
        wrapper(`
            ${eyebrow("Request Confirmed")}
            ${heading(`Tashi Delek, ${accent(data.firstName)}!`)}
            <p>Thank you for choosing <strong>Bhutan Upward Travels</strong> to plan your journey. We have received your tour request and our team is already working on it.</p>

            ${detailsBox("Request Summary", [
                tripSummary(data),
                { label: "Travel Date", value: data.travelDate },
                { label: "Travelers", value: data.travelers },
            ])}

            <p>One of our travel specialists will reach out to you shortly at <strong>${escapeHtml(data.email)}</strong> to discuss your itinerary in detail.</p>

            <p style="margin-top: 32px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),

    operatorNotification: (data: TourRequest) =>
        wrapper(`
            ${eyebrow("Website Lead")}
            ${heading(`New Tour ${accent("Request")} Received`)}
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
                <h3 style="margin: 0 0 12px; font-family: ${MONO_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #78716c;">Message</h3>
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
            ${eyebrow("Booking Update")}
            ${heading(`Great news, ${accent(data.firstName)}! &#127881;`)}
            <p>Your tour request with <strong>Bhutan Upward Travels</strong> has been <strong style="color: ${AMBER};">approved</strong>. We're delighted to help bring your journey to life.</p>

            ${detailsBox("Your Request", [
                tripSummary(data),
                { label: "Travel Date", value: data.travelDate },
                { label: "Travelers", value: data.travelers },
            ])}

            <p>One of our travel specialists will be in touch shortly to finalise the details and next steps. If you have any questions in the meantime, simply reply to this email.</p>

            <p style="margin-top: 32px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),

    requestRejected: (data: TourRequest) =>
        wrapper(`
            ${eyebrow("Booking Update")}
            ${heading(`Update on your ${accent("tour request")}`)}
            <p>Dear ${escapeHtml(data.firstName)},</p>
            <p>Thank you for your interest in travelling with <strong>Bhutan Upward Travels</strong>. After reviewing your request, we're sorry to say we're unable to proceed with it at this time.</p>

            ${detailsBox("Request Reference", [
                tripSummary(data),
                { label: "Travel Date", value: data.travelDate },
            ])}

            <p>This may be due to availability, timing, or other constraints. We'd genuinely love to help you explore Bhutan another time.</p>

            ${ctaButton("Submit a New Request", `${siteUrl()}/plan-my-trip`)}

            <p style="margin-top: 8px;">Warm regards,<br>The Bhutan Upward Travels Team</p>
        `),
};
