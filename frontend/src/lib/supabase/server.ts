import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-based Supabase client for reading/writing the auth session in
// Server Components, Server Actions and Route Handlers.
export async function supabaseServer() {
    const cookieStore = await cookies();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // setAll called from a Server Component — safe to ignore
                    // when middleware refreshes the session.
                }
            },
        },
    });
}

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    role: string;
}

// Returns the signed-in user, or null. Role comes from app_metadata (set
// server-side via the auth admin API, so it can't be self-assigned).
export async function getAuthUser(): Promise<AuthUser | null> {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
        id: user.id,
        email: user.email ?? "",
        username: (user.user_metadata?.username as string) ?? user.email ?? "",
        role:
            (user.app_metadata?.role as string) ??
            (user.user_metadata?.role as string) ??
            "user",
    };
}

export async function getAdminUser(): Promise<AuthUser | null> {
    const user = await getAuthUser();
    return user && user.role === "admin" ? user : null;
}
