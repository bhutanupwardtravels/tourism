
import { z } from "zod";

export const costSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be a positive number"),
    type: z.enum(["fixed", "daily"]).default("fixed"),
    isIndianNational: z.boolean().default(false),
    travelerCategory: z.enum(["adult", "child_6_12", "child_under_6"]).default("adult"),
});

export type Cost = z.infer<typeof costSchema> & {
    id?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
};
