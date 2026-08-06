import { z } from "zod";

// YYYY-MM-DD, matching <input type="date"> values.
const dateStringSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

// Validation for PUBLIC (untrusted) tour-request submissions. Enforces length
// caps so a submission can't stuff huge payloads into the DB or emails. Fields
// not listed here (tourId, tourName, customItinerary, etc.) are set/whitelisted
// server-side and don't need public validation.
export const publicTourRequestSchema = z
    .object({
        firstName: z.string().trim().min(1, "First name is required").max(100),
        lastName: z.string().trim().min(1, "Last name is required").max(100),
        email: z.string().trim().email("Invalid email address").max(254),
        phone: z.string().trim().min(1, "Phone number is required").max(40),
        destination: z.string().trim().max(200).optional(),
        travelDate: z.string().trim().max(100).optional(),
        travelers: z.string().trim().max(50).optional(),
        message: z.string().trim().max(5000).optional(),
        country: z.string().trim().max(5).optional(), // ISO2 country code (analytics)
        // Bespoke builder fields — only present for custom itinerary submissions.
        adults: z.coerce.number().int().min(1).max(50).optional(),
        children_6_12: z.coerce.number().int().min(0).max(50).optional(),
        children_under_6: z.coerce.number().int().min(0).max(50).optional(),
        arrivalDate: dateStringSchema.optional(),
        departureDate: dateStringSchema.optional(),
    })
    .refine(
        (data) => !data.arrivalDate || !data.departureDate || data.departureDate > data.arrivalDate,
        { message: "Departure date must be at least one day after the arrival date", path: ["departureDate"] }
    );

export type PublicTourRequest = z.infer<typeof publicTourRequestSchema>;
