
import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "user"]).default("admin"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    // If password is provided, confirmPassword must match
    if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type User = {
    id?: string;
    _id?: string;
    username: string;
    email: string;
    role: "admin" | "user";
    password?: string;
    confirmPassword?: string;
    createdAt?: string;
    updatedAt?: string;
};
