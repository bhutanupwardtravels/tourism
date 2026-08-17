import { findLeadByCode } from "@/lib/data/promo-leads";
import { getCampaignById } from "@/lib/data/promo-campaigns";
import { getPromoSettings } from "@/lib/data/promotions";
import { countPriorTrips, resolveLoyaltyTier } from "@/lib/data/loyalty";

// I, O, 0 and 1 are omitted: codes get read off a screen and dictated over the
// phone, and those four are where transcription errors come from.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

export function generateCouponCode(prefix: string): string {
    let body = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        body += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return `${prefix.toUpperCase()}-${body}`;
}

export type CouponCheck =
    | { valid: true; percent: number; code: string }
    | { valid: false; reason: string };

/**
 * Server-side coupon validation. Called both for live feedback in the form and
 * again at submit — the form's answer is only ever a hint, never authority.
 *
 * Failure reasons are deliberately specific (expired vs not-yet-redeemable vs
 * already used) because these are the customer's own codes; there's nothing to
 * protect by being vague, and a vague message just generates a support email.
 */
export async function checkCoupon(rawCode: string, email?: string): Promise<CouponCheck> {
    const code = (rawCode || "").trim().toUpperCase();
    if (!code) return { valid: false, reason: "Enter a discount code." };

    const lead = await findLeadByCode(code);
    if (!lead) return { valid: false, reason: "That code isn't recognised." };

    if (lead.redeemedAt) {
        return { valid: false, reason: "That code has already been used." };
    }

    // The code belongs to the address it was issued to.
    if (email && lead.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        return {
            valid: false,
            reason: "That code was issued to a different email address.",
        };
    }

    const now = Date.now();
    if (lead.eligibleFrom && new Date(lead.eligibleFrom).getTime() > now) {
        const from = new Date(lead.eligibleFrom).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        return { valid: false, reason: `That code can be used from ${from}.` };
    }

    if (lead.expiresAt && new Date(lead.expiresAt).getTime() < now) {
        return { valid: false, reason: "That code has expired." };
    }

    if (lead.campaignId) {
        const campaign = await getCampaignById(lead.campaignId);
        if (!campaign || !campaign.isActive) {
            return { valid: false, reason: "That promotion is no longer running." };
        }
    }

    const settings = await getPromoSettings();
    const percent = Math.max(0, Math.min(lead.discountPercent || 0, settings.maxPercent ?? 100));
    if (percent <= 0) return { valid: false, reason: "That code has no discount attached." };

    return { valid: true, percent, code };
}

export interface ResolvedDiscount {
    kind: "none" | "loyalty" | "coupon";
    percent: number;
    priorTrips: number;
    couponCode: string | null;
    couponError: string | null;
}

/**
 * Work out what this applicant actually gets.
 *
 * Best-of, never stacked: a returning traveller holding a coupon gets whichever
 * is worth more, and `kind` records which one won so the operator can see the
 * basis on the request. Both sides are resolved from the database here — the
 * browser's opinion is not an input.
 */
export async function resolveDiscount(
    email: string,
    rawCouponCode?: string
): Promise<ResolvedDiscount> {
    const settings = await getPromoSettings();

    let loyaltyPercent = 0;
    let priorTrips = 0;
    try {
        priorTrips = await countPriorTrips(email, settings.qualifyingStatuses);
        loyaltyPercent = resolveLoyaltyTier(priorTrips, settings);
    } catch (error) {
        // A discount lookup failing must never cost us the lead.
        console.error("Loyalty lookup failed:", error);
    }

    let couponPercent = 0;
    let couponCode: string | null = null;
    let couponError: string | null = null;
    if (rawCouponCode && rawCouponCode.trim()) {
        try {
            const check = await checkCoupon(rawCouponCode, email);
            if (check.valid) {
                couponPercent = check.percent;
                couponCode = check.code;
            } else {
                couponError = check.reason;
            }
        } catch (error) {
            console.error("Coupon check failed:", error);
            couponError = "We couldn't verify that code.";
        }
    }

    const percent = Math.min(
        Math.max(loyaltyPercent, couponPercent),
        settings.maxPercent ?? 100
    );

    if (percent <= 0) {
        return { kind: "none", percent: 0, priorTrips, couponCode: null, couponError };
    }

    // Ties go to the coupon: it's the one the traveller consciously redeemed,
    // and marking it used is what closes the campaign loop.
    const kind = couponPercent >= loyaltyPercent ? "coupon" : "loyalty";

    return {
        kind,
        percent,
        priorTrips,
        couponCode: kind === "coupon" ? couponCode : null,
        couponError,
    };
}
