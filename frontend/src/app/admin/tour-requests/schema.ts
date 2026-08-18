
import { z } from "zod";

export const tourRequestSchema = z.object({
    _id: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    destination: z.string().optional(),
    travelDate: z.string().min(1, "Travel date is required"),
    travelers: z.string().min(1, "Number of travelers is required"),
    // The public plan-my-trip form lets travellers submit without a note, and
    // the column defaults to '' — so this is optional on the way in even though
    // the admin form still asks for it.
    message: z.string().optional(),
    tourId: z.string().optional(),
    tourName: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected", "archived"]),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type TourRequestSchema = z.infer<typeof tourRequestSchema>;
