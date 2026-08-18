
import { z } from "zod";

export const costSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be a positive number"),
    type: z.enum(["fixed", "daily"]).default("fixed"),
    isIndianNational: z.boolean().default(false),
    travelerCategory: z.enum(["adult", "child_6_12", "child_under_6"]).default("adult"),
});

/**
 * What the cost form holds while being edited. Distinct from the validated
 * output because the schema's `.default()`s make those fields optional on the
 * way in and guaranteed on the way out.
 */
export type CostInput = z.input<typeof costSchema>;
export type CostOutput = z.output<typeof costSchema>;

export type Cost = CostOutput & {
    id?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
};
