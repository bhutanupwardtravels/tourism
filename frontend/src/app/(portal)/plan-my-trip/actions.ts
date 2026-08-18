"use server";

// Not the raw tour table: the website action layer resolves tour.category,
// which is stored as an experience-type id, into its display title. Reading
// the table directly leaves that id unresolved and the package cards render
// a raw uuid where the category badge should be.
import { getAllTours } from "@/app/(website)/tours/actions";
import * as destinationDb from "@/lib/data/destinations";
import * as experienceDb from "@/lib/data/experiences";
import { tourRequestDb } from "@/lib/data/tour-requests";
import type { TourRequest } from "@/app/admin/tour-requests/types";
import { Tour } from "@/app/(website)/tours/schema";
import { Destination } from "@/app/(website)/destinations/schema";
import { Experience } from "@/app/(website)/experiences/schema";

import * as hotelDb from "@/lib/data/hotels";
import { Hotel } from "../../admin/hotels/schema";
import { Cost } from "../../admin/settings/schema";
import * as settingsDb from "@/lib/data/settings";

export interface PlanMyTripData {
    packages: Tour[];
    destinations: Destination[];
    allDestinations: Destination[];
    experiences: Experience[];
    hotels: Hotel[];
    costs: Cost[];
}

export async function getPlanMyTripData(): Promise<PlanMyTripData> {
    try {
        const [allTours, entryPointDestinations, allDestinations, allExperiences, allHotels, allCosts] = await Promise.all([
            getAllTours(),
            destinationDb.getEntryPointDestinations(),
            destinationDb.getAllDestinations(),
            experienceDb.getAllExperiences(),
            hotelDb.getAllHotels(),
            settingsDb.getAllCosts()
        ]);

        // Filter packages if needed (e.g. only featured or specific category)
        // For now we return the top 4 featured or general tours as "packages"
        const packages = (allTours.filter((t) => t.featured).slice(0, 4)) as unknown as Tour[];
        // Fallback if no featured tours
        const finalPackages = packages.length > 0 ? packages : (allTours.slice(0, 4) as Tour[]);

        return {
            packages: finalPackages,
            destinations: entryPointDestinations as Destination[],
            allDestinations: allDestinations as Destination[],
            experiences: allExperiences as Experience[],
            hotels: allHotels as Hotel[],
            costs: allCosts as Cost[]
        };

    } catch (error) {
        console.error("Error fetching Plan My Trip data:", error);
        return {
            packages: [],
            destinations: [],
            allDestinations: [],
            experiences: [],
            hotels: [],
            costs: []
        };
    }
}

import { headers } from "next/headers";
import { sendMail, senders } from "@/lib/mail";
import { emailTemplates } from "@/lib/email/templates";
import { publicTourRequestSchema } from "./schema";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { buildQuote, applyDiscount, PricedItem } from "@/lib/pricing/quote";
import { resolveDiscount, checkCoupon, generateCouponCode } from "@/lib/promotions/coupon";
import { getPromoSettings } from "@/lib/data/promotions";
import { countPriorTrips, resolveLoyaltyTier } from "@/lib/data/loyalty";
import { getCampaignById } from "@/lib/data/promo-campaigns";
import * as leadDb from "@/lib/data/promo-leads";
import { claimCouponSchema } from "@/app/admin/promotions/leads/schema";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/promotions/consent";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getOperatorEmails } from "@/lib/data/operator-emails";

// Max public submissions per IP within the window before we start rejecting.
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600; // 10 minutes

async function getClientIp(): Promise<string> {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
}

/**
 * `data` arrives straight from the browser, so it is typed as an untrusted JSON
 * object and only reaches the database via `publicTourRequestSchema`.
 */
export async function submitTourRequest(data: Record<string, unknown>) {
    try {
        // 1. Honeypot: a hidden field real users never fill. If it has a value,
        //    it's almost certainly a bot — pretend success and drop it silently.
        if (typeof data?.company === "string" && data.company.trim() !== "") {
            return { success: true };
        }

        const ip = await getClientIp();

        // 2. Rate limit per IP.
        const rl = await checkRateLimit(`tour_request:${ip}`, RATE_LIMIT, RATE_WINDOW_SECONDS);
        if (!rl.allowed) {
            return { success: false, error: "Too many requests. Please try again later." };
        }

        // 3. Bot challenge.
        const passed = await verifyTurnstile(
            typeof data?.turnstileToken === "string" ? data.turnstileToken : undefined,
            ip
        );
        if (!passed) {
            return { success: false, error: "Verification failed. Please try again." };
        }

        // 4. Validate + length-cap the untrusted fields.
        const parsed = publicTourRequestSchema.safeParse(data);
        if (!parsed.success) {
            return { success: false, error: "Please check the form and try again." };
        }

        // 5. Build the insert doc from validated data. tourId/tourName and the
        //    custom itinerary are set server-side/denormalized; cap the strings.
        //    createTourRequest whitelists columns, so honeypot/token are dropped.
        // Only accept a plausibly-sized itinerary array (the builder caps trips
        // well under this); anything else is dropped rather than stored.
        const customItinerary =
            Array.isArray(data.customItinerary) && data.customItinerary.length <= 60
                ? data.customItinerary
                : undefined;

        const doc: Omit<TourRequest, "_id" | "createdAt" | "updatedAt" | "status"> = {
            ...parsed.data,
            tourId: typeof data.tourId === "string" ? data.tourId.slice(0, 100) : undefined,
            tourName: typeof data.tourName === "string" ? data.tourName.slice(0, 200) : undefined,
            customItinerary,
        };

        // 5b. Resolve the discount from the database. Whatever percentage the
        //     browser displayed is irrelevant here — loyalty is recounted from
        //     the requester's approved history and the coupon is re-validated,
        //     best-of, capped by the admin's ceiling.
        const discount = await resolveDiscount(
            parsed.data.email,
            typeof data.couponCode === "string" ? data.couponCode.slice(0, 32) : undefined
        );

        doc.discountKind = discount.kind;
        doc.discountPercent = discount.percent;
        doc.couponCode = discount.couponCode;
        doc.priorTripCount = discount.priorTrips;

        // 5c. Rebuild the quote from our own copy of the catalogue. Only the
        //     bespoke builder has enough information to price a trip (real
        //     traveller counts and dates); the package and general-enquiry
        //     flows submit a bucketed traveller string, so they carry the
        //     discount percentage alone for the operator to apply by hand.
        if (customItinerary) {
            try {
                const [costs, allExperiences, allHotels] = await Promise.all([
                    settingsDb.getAllCosts(),
                    experienceDb.getAllExperiences(),
                    hotelDb.getAllHotels(),
                ]);

                const quote = buildQuote({
                    costs: costs as Cost[],
                    country: parsed.data.country,
                    adults: parsed.data.adults,
                    children_6_12: parsed.data.children_6_12,
                    children_under_6: parsed.data.children_under_6,
                    arrivalDate: parsed.data.arrivalDate,
                    departureDate: parsed.data.departureDate,
                    customItinerary,
                    experiences: allExperiences as PricedItem[],
                    hotels: allHotels as PricedItem[],
                });

                const priced = applyDiscount(quote.subtotal, discount.percent);
                doc.quoteSubtotal = Math.round(quote.subtotal);
                doc.discountAmount = priced.discountAmount;
                doc.quoteTotal = priced.total;
                doc.quoteCurrency = "USD";
            } catch (error) {
                // A pricing failure must not cost us the enquiry; the operator
                // can still quote manually from the stored itinerary.
                console.error("Failed to build quote for tour request:", error);
            }
        }

        const result = await tourRequestDb.createTourRequest(doc);

        // 6. Send notifications. Awaited (not fire-and-forget) so they actually
        //    deliver on serverless, where the function may freeze right after
        //    returning. Email failures are logged but don't fail the request —
        //    the lead is already saved in the DB.
        const operatorEmails = await getOperatorEmails();
        const mailResults = await Promise.allSettled([
            sendMail({
                to: parsed.data.email,
                subject: "Your Tour Request - Bhutan Upward Travels",
                html: emailTemplates.userConfirmation(result),
                from: senders.confirmation(),
                // hello@ may not be a monitored inbox yet — route replies to the operator(s).
                replyTo: operatorEmails,
            }),
            sendMail({
                to: operatorEmails,
                subject: `${parsed.data.firstName} ${parsed.data.lastName} — ${result.tourName || "Custom Trip"}`,
                html: emailTemplates.operatorNotification(result),
                from: senders.operatorNotification(),
                // Lets the operator hit "reply" and email the customer directly.
                replyTo: parsed.data.email,
            }),
        ]);
        mailResults.forEach((r, i) => {
            const which = i === 0 ? "user confirmation" : "operator notification";
            if (r.status === "rejected") {
                console.error(`Email (${which}) threw:`, r.reason);
            } else if (!r.value?.success) {
                console.error(`Email (${which}) failed:`, r.value?.error);
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit tour request:", error);
        return { success: false, error: "Submission failed" };
    }
}

// ---- Promotions ----------------------------------------------------------

// Looking up a discount by email is, unavoidably, an oracle for "has this
// address booked with us". It returns nothing but a percentage and a count, and
// it's capped per IP, so it can't be walked to build a customer list.
const LOOKUP_RATE_LIMIT = 20;
const CLAIM_RATE_LIMIT = 3;

/**
 * The returning-traveller discount for an email, for live display in the forms.
 * Advisory only — submitTourRequest recomputes this independently.
 */
export async function lookupTravellerDiscount(email: string) {
    const empty = { percent: 0, priorTrips: 0, teaserText: "" };
    try {
        const normalised = (email || "").trim();
        if (!normalised || !normalised.includes("@")) return empty;

        const ip = await getClientIp();
        const rl = await checkRateLimit(`loyalty_lookup:${ip}`, LOOKUP_RATE_LIMIT, RATE_WINDOW_SECONDS);
        if (!rl.allowed) return empty;

        const settings = await getPromoSettings();
        if (!settings.loyaltyEnabled) return empty;

        const priorTrips = await countPriorTrips(normalised, settings.qualifyingStatuses);
        const percent = resolveLoyaltyTier(priorTrips, settings);

        return { percent, priorTrips, teaserText: settings.teaserText };
    } catch (error) {
        console.error("Traveller discount lookup failed:", error);
        return empty;
    }
}

/** Live validation for the coupon field. Re-checked at submit regardless. */
export async function validateCoupon(code: string, email?: string) {
    try {
        const ip = await getClientIp();
        const rl = await checkRateLimit(`coupon_check:${ip}`, LOOKUP_RATE_LIMIT, RATE_WINDOW_SECONDS);
        if (!rl.allowed) {
            return { valid: false as const, reason: "Too many attempts. Please try again later." };
        }

        return await checkCoupon(code, email);
    } catch (error) {
        console.error("Coupon validation failed:", error);
        return { valid: false as const, reason: "We couldn't verify that code." };
    }
}

/**
 * Exchange contact details for a discount code.
 *
 * Same pipeline as submitTourRequest — honeypot, per-IP rate limit, Turnstile,
 * Zod — because it's the same class of public, unauthenticated write. The code
 * is emailed as well as returned: an address that never receives it is worth
 * nothing to the follow-up campaign this feature exists to feed.
 */
export async function claimCoupon(data: Record<string, unknown>) {
    try {
        if (typeof data?.company === "string" && data.company.trim() !== "") {
            return { success: true, code: "" };
        }

        const ip = await getClientIp();

        const rl = await checkRateLimit(`coupon_claim:${ip}`, CLAIM_RATE_LIMIT, RATE_WINDOW_SECONDS);
        if (!rl.allowed) {
            return { success: false, error: "Too many requests. Please try again later." };
        }

        const passed = await verifyTurnstile(
            typeof data?.turnstileToken === "string" ? data.turnstileToken : undefined,
            ip
        );
        if (!passed) {
            return { success: false, error: "Verification failed. Please try again." };
        }

        const parsed = claimCouponSchema.safeParse(data);
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
            };
        }

        const campaign = await getCampaignById(parsed.data.campaignId);
        if (!campaign || !campaign.isActive) {
            return { success: false, error: "This offer has ended." };
        }

        // Re-check the window server-side: the banner decides visibility in the
        // browser, so a stale tab could still post after the campaign closed.
        const now = Date.now();
        if (campaign.bannerStartsAt && new Date(campaign.bannerStartsAt).getTime() > now) {
            return { success: false, error: "This offer hasn't started yet." };
        }
        if (campaign.bannerEndsAt && new Date(campaign.bannerEndsAt).getTime() < now) {
            return { success: false, error: "This offer has ended." };
        }

        if (campaign.maxIssued) {
            const issued = await leadDb.countIssuedForCampaign(parsed.data.campaignId);
            if (issued >= campaign.maxIssued) {
                return { success: false, error: "All codes for this offer have been claimed." };
            }
        }

        if (await leadDb.hasClaimed(parsed.data.campaignId, parsed.data.email)) {
            return {
                success: false,
                error: "A code has already been sent to that email address. Please check your inbox.",
            };
        }

        const issuedAt = new Date();
        const eligibleFrom = new Date(issuedAt);
        eligibleFrom.setDate(eligibleFrom.getDate() + (campaign.couponEligibleAfterDays || 0));
        const expiresAt = new Date(issuedAt);
        expiresAt.setDate(expiresAt.getDate() + campaign.couponValidDays);

        // Retry on the (vanishingly unlikely) unique-code collision rather than
        // failing a claim the visitor already paid for with their details.
        let lead = null;
        let lastError: unknown = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                lead = await leadDb.createLead({
                    campaignId: parsed.data.campaignId,
                    code: generateCouponCode(campaign.codePrefix),
                    firstName: parsed.data.firstName,
                    lastName: parsed.data.lastName,
                    email: parsed.data.email,
                    phone: parsed.data.phone,
                    country: parsed.data.country,
                    discountPercent: campaign.discountPercent,
                    marketingConsent: true,
                    consentAt: issuedAt.toISOString(),
                    consentText: `${CONSENT_TEXT} (v${CONSENT_VERSION})`,
                    source: "banner",
                    issuedAt: issuedAt.toISOString(),
                    eligibleFrom: eligibleFrom.toISOString(),
                    expiresAt: expiresAt.toISOString(),
                });
                break;
            } catch (error) {
                lastError = error;
                // 23505 = unique_violation. Only a collision on the code index is
                // worth retrying — a hit on promo_leads_campaign_email_key means
                // this address already claimed, and retrying would just loop.
                const detail = error as { code?: string; message?: string };
                if (
                    detail?.code === "23505" &&
                    !String(detail?.message ?? "").includes("promo_leads_code_key")
                ) {
                    return {
                        success: false,
                        error: "A code has already been sent to that email address.",
                    };
                }
            }
        }

        if (!lead) {
            console.error("Failed to issue coupon code:", lastError);
            return { success: false, error: "We couldn't issue a code. Please try again." };
        }

        // Awaited, not fire-and-forget: on serverless the function can freeze
        // the moment it returns. A send failure doesn't fail the claim — the
        // code is already on screen and the lead is already saved.
        const mail = await sendMail({
            to: lead.email,
            subject: `Your ${campaign.discountPercent}% discount code — Bhutan Upward Travels`,
            html: emailTemplates.couponIssued(lead, campaign),
            from: senders.coupon(),
            replyTo: await getOperatorEmails(),
        });
        if (!mail.success) console.error("Coupon email failed:", mail.error);

        return { success: true, code: lead.code, discountPercent: lead.discountPercent };
    } catch (error) {
        console.error("Failed to claim coupon:", error);
        return { success: false, error: "Submission failed" };
    }
}
