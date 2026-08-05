import { z } from "zod";

export const chatRequestSchema = z.object({
    message: z.string().trim().min(1, "Message is required").max(2000),
    history: z
        .array(
            z.object({
                role: z.enum(["user", "model"]),
                content: z.string().trim().max(2000),
            })
        )
        .max(20)
        .optional()
        .default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatMessage = ChatRequest["history"][number];
