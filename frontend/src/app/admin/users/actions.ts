
"use server";

import { revalidatePath } from "next/cache";
import { createUser, updateUser, deleteUser, getUserByEmail, listUsers as listUsersData } from "@/lib/data/users";
import { userSchema } from "./schema";

export async function listUsers(page: number, pageSize: number, search?: string) {
    return await listUsersData(page, pageSize, search);
}

export async function createUserAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    const validatedFields = userSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed: " + validatedFields.error.issues.map(e => e.message).join(", "),
        };
    }

    const { username, email, role, password } = validatedFields.data;

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
        return { success: false, message: "A user with this email already exists." };
    }

    if (!password || password.length === 0) {
        return { success: false, message: "Password is required for new users." };
    }

    try {
        // Supabase Auth stores the (hashed) password itself
        await createUser({
            username,
            email,
            role,
            password,
        });

        revalidatePath("/admin/users");
        return { success: true, message: "User created successfully" };
    } catch (error) {
        return { success: false, message: "Failed to create user" };
    }
}

export async function updateUserAction(id: string, prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = userSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed: " + validatedFields.error.issues.map(e => e.message).join(", "),
        };
    }

    const { username, email, role, password } = validatedFields.data;

    const updateData: any = {
        username,
        email,
        role,
    };

    // Only update password if provided
    if (password && password.length > 0) {
        updateData.password = password;
    }

    try {
        await updateUser(id, updateData);
        revalidatePath("/admin/users");
        return { success: true, message: "User updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update user" };
    }
}

export async function deleteUserAction(id: string) {
    try {
        await deleteUser(id);
        revalidatePath("/admin/users");
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed to delete user" };
    }
}
