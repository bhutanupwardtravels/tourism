import { z } from "zod";

/** Validation for the PUBLIC (untrusted) coupon-claim form. */
export const claimCouponSchema = z.object({
    campaignId: z.string().trim().min(1).max(64),
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(254),
    phone: z.string().trim().min(1, "Phone number is required").max(40),
    country: z.string().trim().min(1, "Nationality is required").max(5), // ISO2
    // The privacy policy promises marketing email only with explicit consent,
    // and these addresses exist to be contacted months later — so this is
    // required, not optional.
    marketingConsent: z.literal(true, {
        message: "Please agree to be contacted so we can send your code",
    }),
});

export type ClaimCouponInput = z.infer<typeof claimCouponSchema>;

export interface PromoLead {
    _id?: string;
    id?: string;
    campaignId?: string | null;
    code: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country?: string | null;
    discountPercent: number;
    marketingConsent: boolean;
    consentAt?: string | null;
    consentText?: string;
    source?: string;
    issuedAt?: string;
    eligibleFrom?: string | null;
    expiresAt?: string | null;
    redeemedAt?: string | null;
    redeemedRequestId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedLeads {
    items: PromoLead[];
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}
