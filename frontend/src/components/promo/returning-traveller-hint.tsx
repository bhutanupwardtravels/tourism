"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { getLoyaltyTeaser } from "@/app/(portal)/plan-my-trip/actions";
import { cn } from "@/lib/utils";

interface ReturningTravellerHintProps {
    /** "dark" for the panels that sit on black. */
    tone?: "light" | "dark";
    className?: string;
}

/**
 * Sits above the email field: tells a returning traveller to apply with the
 * address they booked with, because the loyalty discount is resolved from that
 * address alone. Renders nothing when loyalty is switched off or no tier is
 * worth anything, so the forms never promise a discount that resolves to 0%.
 *
 * The wording is the admin-authored teaser from Promotions → Loyalty → Settings.
 */
export function ReturningTravellerHint({ tone = "light", className }: ReturningTravellerHintProps) {
    const [teaser, setTeaser] = useState<{ text: string; maxPercent: number } | null>(null);

    useEffect(() => {
        let cancelled = false;
        getLoyaltyTeaser()
            .then((result) => {
                if (cancelled || !result.enabled || !result.teaserText.trim()) return;
                setTeaser({ text: result.teaserText, maxPercent: result.maxTierPercent });
            })
            .catch(() => {
                // A missing hint is not worth surfacing — the discount still applies.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!teaser) return null;

    const dark = tone === "dark";

    return (
        <div
            className={cn(
                "flex items-start gap-3 border p-4",
                dark ? "border-amber-500/30 bg-amber-500/5" : "border-amber-600/30 bg-amber-50/60",
                className
            )}
        >
            <Sparkles className={cn("w-4 h-4 mt-0.5 shrink-0", dark ? "text-amber-500" : "text-amber-600")} />
            <p className={cn("text-xs font-light leading-relaxed", dark ? "text-white/70" : "text-gray-600")}>
                {teaser.text}
                {teaser.maxPercent > 0 && (
                    <span className={cn("font-medium", dark ? "text-amber-500" : "text-amber-700")}>
                        {" "}Up to {teaser.maxPercent}% off.
                    </span>
                )}
            </p>
        </div>
    );
}
