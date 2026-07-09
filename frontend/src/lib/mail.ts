import { Resend } from "resend";

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendMail({ to, subject, html }: MailOptions) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not configured; skipping email send");
        return { success: false, error: "RESEND_API_KEY not configured" };
    }

    try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            // onboarding@resend.dev works without a verified domain (testing only)
            from: process.env.EMAIL_FROM || "Black Tomato Bhutan <onboarding@resend.dev>",
            to,
            subject,
            html,
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
