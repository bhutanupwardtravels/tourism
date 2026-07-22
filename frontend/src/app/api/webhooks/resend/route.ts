import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

interface ResendWebhookEvent {
    type: string;
    created_at: string;
    data: {
        email_id: string;
        from: string;
        to: string[];
        subject: string;
        [key: string]: unknown;
    };
}

export async function POST(request: NextRequest) {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
        console.error("RESEND_WEBHOOK_SECRET is not configured; rejecting webhook");
        return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const payload = await request.text();
    const svixHeaders = {
        "svix-id": request.headers.get("svix-id") ?? "",
        "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
        "svix-signature": request.headers.get("svix-signature") ?? "",
    };

    let event: ResendWebhookEvent;
    try {
        const wh = new Webhook(secret);
        event = wh.verify(payload, svixHeaders) as ResendWebhookEvent;
    } catch (error) {
        console.error("Invalid Resend webhook signature:", error);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
        case "email.bounced":
            console.warn("Resend: email bounced", { to: event.data.to, emailId: event.data.email_id });
            break;
        case "email.complained":
            console.warn("Resend: recipient marked email as spam", { to: event.data.to, emailId: event.data.email_id });
            break;
        case "email.delivered":
            console.log("Resend: email delivered", { to: event.data.to, emailId: event.data.email_id });
            break;
        default:
            console.log("Resend webhook event:", event.type);
    }

    return NextResponse.json({ received: true });
}
