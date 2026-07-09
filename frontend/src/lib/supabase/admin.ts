import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Service-role client for server-side data access, storage and auth admin.
// Never import this from client components — the service key bypasses RLS.

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
    if (cached) return cached;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            'Missing environment variables: "NEXT_PUBLIC_SUPABASE_URL" and/or "SUPABASE_SERVICE_ROLE_KEY"'
        );
    }

    cached = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return cached;
}
