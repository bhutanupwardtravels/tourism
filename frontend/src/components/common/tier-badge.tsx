import { TIER_META, type TourTier } from "@/lib/pricing/tour-tier";
import { cn } from "@/lib/utils";

/**
 * The comfort tier that drives the price, stated on the card rather than left
 * to be inferred from the number. Paired with the signature hotel brand it
 * turns "why is this one $17,005?" into a one-glance answer.
 */

const TIER_STYLES: Record<TourTier, { light: string; dark: string }> = {
    comfort: {
        light: "bg-neutral-100 text-neutral-700 border-black/10",
        dark: "bg-white/10 text-white/80 border-white/20",
    },
    premium: {
        light: "bg-amber-50 text-amber-800 border-amber-600/30",
        dark: "bg-amber-500/15 text-amber-200 border-amber-400/40",
    },
    luxury: {
        light: "bg-black text-white border-black",
        dark: "bg-amber-500 text-black border-amber-500",
    },
};

interface TierBadgeProps {
    tier: TourTier | null | undefined;
    signatureStay?: string | null;
    variant?: "light" | "dark";
    className?: string;
}

export function TierBadge({ tier, signatureStay, variant = "light", className }: TierBadgeProps) {
    if (!tier) return null;
    const meta = TIER_META[tier];

    return (
        <span
            title={meta.summary}
            className={cn(
                "inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap",
                TIER_STYLES[tier][variant],
                className
            )}
        >
            {meta.label}
            {signatureStay && (
                <span className="font-medium tracking-[0.08em] opacity-70">· {signatureStay}</span>
            )}
        </span>
    );
}
