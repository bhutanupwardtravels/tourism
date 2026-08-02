import { z } from "zod";

// Validation for PUBLIC (untrusted) tour-request submissions. Enforces length
// caps so a submission can't stuff huge payloads into the DB or emails. Fields
// not listed here (tourId, tourName, customItinerary, etc.) are set/whitelisted
// server-side and don't need public validation.
export const publicTourRequestSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(254),
    phone: z.string().trim().min(1, "Phone number is required").max(40),
    destination: z.string().trim().max(200).optional(),
    travelDate: z.string().trim().max(100).optional(),
    travelers: z.string().trim().max(50).optional(),
    message: z.string().trim().max(5000).optional(),
});

export type PublicTourRequest = z.infer<typeof publicTourRequestSchema>;
