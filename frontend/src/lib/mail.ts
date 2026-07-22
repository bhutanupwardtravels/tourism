import { Resend } from "resend";

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}

// EMAIL_FROM's domain (e.g. "hello@bhutanupwardtravels.bt" -> "bhutanupwardtravels.bt")
// is verified in Resend for the whole domain, so any local part works without
// further DNS setup. Falls back to onboarding@resend.dev (only address that
// works without a verified domain) if EMAIL_FROM isn't configured.
function fromAddress(localPart: string, displayName = "Bhutan Upward Travels") {
    const domain = process.env.EMAIL_FROM?.match(/@([^\s>]+)/)?.[1];
    if (!domain || domain === "resend.dev") {
        return `${displayName} <onboarding@resend.dev>`;
    }
    return `${displayName} <${localPart}@${domain}>`;
}

// Per-email-type sender addresses, so recipients can filter/recognize the
// purpose of an email at a glance and inbox rules can route accordingly.
export const senders = {
    confirmation: () => fromAddress("confirmation"),
    approved: () => fromAddress("reservations"),
    rejected: () => fromAddress("support"),
    operatorNotification: () => fromAddress("notifications"),
};

export async function sendMail({ to, subject, html, from, replyTo }: MailOptions) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not configured; skipping email send");
        return { success: false, error: "RESEND_API_KEY not configured" };
    }

    try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from: from || process.env.EMAIL_FROM || "Bhutan Upward Travels <onboarding@resend.dev>",
            to,
            subject,
            html,
            ...(replyTo ? { replyTo } : {}),
        });

        if (error) {
            console.error("Error sending email:", error);
            return { success: false, error };
        }

        console.log("Email sent: %s", data?.id);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
