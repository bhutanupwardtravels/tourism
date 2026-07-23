"use server";

import * as tourDb from "@/lib/data/tours";
import * as destinationDb from "@/lib/data/destinations";
import * as experienceDb from "@/lib/data/experiences";
import { tourRequestDb } from "@/lib/data/tour-requests";
import { Tour } from "../tours/schema";
import { Destination } from "../destinations/schema";
import { Experience } from "../experiences/schema";

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
            tourDb.getAllTours(),
            destinationDb.getEntryPointDestinations(),
            destinationDb.getAllDestinations(),
            experienceDb.getAllExperiences(),
            hotelDb.getAllHotels(),
            settingsDb.getAllCosts()
        ]);

        // Filter packages if needed (e.g. only featured or specific category)
        // For now we return the top 4 featured or general tours as "packages"
        const packages = (allTours.filter((t: any) => t.featured).slice(0, 4)) as Tour[];
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
import { verifyTurnstile } from "@/lib/security/turnstile";

// Max public submissions per IP within the window before we start rejecting.
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600; // 10 minutes

async function getClientIp(): Promise<string> {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
}

export async function submitTourRequest(data: any) {
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
        const passed = await verifyTurnstile(data?.turnstileToken, ip);
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

        const doc: any = {
            ...parsed.data,
            tourId: typeof data.tourId === "string" ? data.tourId.slice(0, 100) : undefined,
            tourName: typeof data.tourName === "string" ? data.tourName.slice(0, 200) : undefined,
            customItinerary,
        };

        const result = await tourRequestDb.createTourRequest(doc);

        // 6. Send notifications. Awaited (not fire-and-forget) so they actually
        //    deliver on serverless, where the function may freeze right after
        //    returning. Email failures are logged but don't fail the request —
        //    the lead is already saved in the DB.
        const operatorEmail = process.env.OPERATOR_EMAIL || "info@bhutanupwardtravels.com";
        const mailResults = await Promise.allSettled([
            sendMail({
                to: parsed.data.email,
                subject: "Your Tour Request - Bhutan Upward Travels",
                html: emailTemplates.userConfirmation(result),
                from: senders.confirmation(),
                // hello@ may not be a monitored inbox yet — route replies to the operator.
                replyTo: operatorEmail,
            }),
            sendMail({
                to: operatorEmail,
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
