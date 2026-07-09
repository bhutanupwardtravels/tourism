"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function loginAction(email: string, password: string) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        if (error.code === "invalid_credentials") {
            return { error: "Invalid email or password." };
        }
        return { error: error.message || "Authentication failed. Please try again." };
    }

    const role =
        (data.user?.app_metadata?.role as string) ??
        (data.user?.user_metadata?.role as string);

    if (role !== "admin") {
        await supabase.auth.signOut();
        return { error: "This account does not have admin access." };
    }

    return { success: true };
}
