import { supabaseAdmin } from "../supabase/admin";

const TABLE = "rate_limit_hits";

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
}

/**
 * Sliding-window rate limiter backed by Supabase.
 *
 * Counts hits for `bucket` within the last `windowSeconds`; if under `limit`,
 * records a new hit and allows the request. Not strictly atomic (count-then-
 * insert), which is acceptable for low-volume public forms. Old rows for the
 * bucket are cleaned up opportunistically on each call.
 *
 * Fails OPEN: if the DB is unreachable, the request is allowed rather than
 * blocking a legitimate customer. Turnstile + honeypot remain as backstops.
 */
export async function checkRateLimit(
    bucket: string,
    limit: number,
    windowSeconds: number
): Promise<RateLimitResult> {
    const supabase = supabaseAdmin();
    const now = Date.now();
    const windowStart = new Date(now - windowSeconds * 1000).toISOString();

    try {
        const { count, error } = await supabase
            .from(TABLE)
            .select("id", { count: "exact", head: true })
            .eq("bucket", bucket)
            .gte("created_at", windowStart);

        if (error) throw error;

        const used = count ?? 0;
        if (used >= limit) {
            return { allowed: false, remaining: 0 };
        }

        await supabase.from(TABLE).insert({ bucket });

        // Opportunistic cleanup of expired rows for this bucket.
        await supabase.from(TABLE).delete().eq("bucket", bucket).lt("created_at", windowStart);

        return { allowed: true, remaining: Math.max(0, limit - used - 1) };
    } catch (err) {
        console.error("Rate limit check failed; allowing request:", err);
        return { allowed: true, remaining: 0 };
    }
}
