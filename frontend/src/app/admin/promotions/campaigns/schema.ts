import { z } from "zod";

// Codes are read off a screen and dictated over the phone, so the prefix is
// kept short and uppercase-only.
export const campaignSchema = z
    .object({
        name: z.string().trim().min(1, "Name is required").max(120),
        codePrefix: z
            .string()
            .trim()
            .min(2, "Prefix must be at least 2 characters")
            .max(8)
            .regex(/^[A-Z0-9]+$/, "Use uppercase letters and digits only"),
        discountPercent: z.number().min(0, "Cannot be negative").max(100, "Cannot exceed 100%"),
        bannerHeadline: z.string().trim().min(1, "Headline is required").max(120),
        bannerBody: z.string().trim().max(400),
        bannerCtaLabel: z.string().trim().min(1, "CTA label is required").max(40),
        // datetime-local values; empty string means "no bound".
        bannerStartsAt: z.string().optional(),
        bannerEndsAt: z.string().optional(),
        couponValidDays: z.number().int().min(1, "Must be at least 1 day").max(3650),
        couponEligibleAfterDays: z.number().int().min(0).max(3650),
        maxIssued: z.number().int().min(1).nullable().optional(),
        isActive: z.boolean(),
        priority: z.number(),
    })
    .refine(
        (d) => !d.bannerStartsAt || !d.bannerEndsAt || d.bannerEndsAt > d.bannerStartsAt,
        { message: "Banner end must be after the start", path: ["bannerEndsAt"] }
    )
    .refine((d) => d.couponEligibleAfterDays < d.couponValidDays, {
        message: "Codes would expire before they became redeemable",
        path: ["couponEligibleAfterDays"],
    });

export type PromoCampaign = z.infer<typeof campaignSchema> & {
    id?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
};

export interface PaginatedCampaigns {
    items: PromoCampaign[];
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}
