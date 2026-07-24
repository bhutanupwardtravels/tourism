import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "./schema";
import { streamChatReply, ChatStreamError } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/security/rate-limit";

// Max chat messages per IP within the window before we start rejecting.
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 600; // 10 minutes

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Please check your message and try again." }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rl = await checkRateLimit(`chat:${ip}`, RATE_LIMIT, RATE_WINDOW_SECONDS);
    if (!rl.allowed) {
        return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
    }

    const generator = streamChatReply(parsed.data.history, parsed.data.message);

    // Peek the first chunk so failures that happen before any output (missing
    // key, all models rate-limited, etc.) can still return a clean JSON error
    // instead of a stream that immediately closes with nothing in it.
    let first: IteratorResult<string>;
    try {
        first = await generator.next();
    } catch (error) {
        const status = error instanceof ChatStreamError && error.code === "rate_limited" ? 429 : 500;
        const message = error instanceof ChatStreamError ? error.message : "Failed to generate a reply";
        return NextResponse.json({ error: message }, { status });
    }

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const encoder = new TextEncoder();
            if (!first.done) {
                controller.enqueue(encoder.encode(first.value));
            }
            try {
                for await (const chunk of generator) {
                    controller.enqueue(encoder.encode(chunk));
                }
            } catch (error) {
                console.error("Chat stream aborted mid-response:", error);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
