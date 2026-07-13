const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token server-side.
 *
 * If TURNSTILE_SECRET_KEY is not configured, verification is SKIPPED (returns
 * true) so local/dev without keys still works. Configure the key in production
 * to actually enforce the challenge.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        console.warn("TURNSTILE_SECRET_KEY not set; skipping Turnstile verification");
        return true;
    }

    if (!token) return false;

    try {
        const body = new URLSearchParams({ secret, response: token });
        if (ip) body.append("remoteip", ip);

        const res = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });
        const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
        if (!data.success) {
            console.warn("Turnstile verification failed:", data["error-codes"]);
        }
        return data.success === true;
    } catch (err) {
        console.error("Turnstile verification error:", err);
        return false;
    }
}
