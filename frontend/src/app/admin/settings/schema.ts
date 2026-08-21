import { z } from "zod";

/**
 * Which travellers a cost is charged to. Replaces the old
 * Indian/international boolean, which had no way to express "everyone" — so a
 * guide fee flagged for one nationality silently vanished for the other.
 */
export const COST_APPLIES_TO = ["everyone", "indian", "international"] as const;

/** Per traveller, or once for the whole party (guide, driver, vehicle). */
export const COST_CHARGE_BASIS = ["per_person", "per_group"] as const;

export const costSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be a positive number"),
    type: z.enum(["fixed", "daily"]).default("fixed"),
    appliesTo: z.enum(COST_APPLIES_TO).default("international"),
    chargeBasis: z.enum(COST_CHARGE_BASIS).default("per_person"),
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
    /** Pre-`applies_to` rows only; read as a fallback, never written. */
    isIndianNational?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export const COST_APPLIES_TO_LABELS: Record<(typeof COST_APPLIES_TO)[number], string> = {
    everyone: "Everyone",
    indian: "Indian nationals",
    international: "Other nationalities",
};

export const COST_CHARGE_BASIS_LABELS: Record<(typeof COST_CHARGE_BASIS)[number], string> = {
    per_person: "Per person",
    per_group: "Per group",
};
