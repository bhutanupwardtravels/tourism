import { Sparkles } from "lucide-react";
import { PromoSettings } from "@/lib/data/promotions";

/** Mirrors resolveLoyaltyTier: highest threshold met wins, capped by maxPercent. */
function previewPercent(settings: PromoSettings, trips: number) {
    if (!settings.loyaltyEnabled || trips <= 0) return 0;
    const earned = settings.tiers
        .filter((t) => trips >= t.minPriorTrips)
        .reduce((best, t) => Math.max(best, t.percent), 0);
    return Math.min(earned, settings.maxPercent);
}

export function LoyaltyPreview({ settings }: { settings: PromoSettings }) {
    return (
        <div className="border border-amber-200 bg-amber-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Preview</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[1, 2, 3, 5, 10].map((trips) => (
                    <div key={trips} className="text-sm">
                        <div className="text-neutral-500">
                            {trips} previous {trips === 1 ? "trip" : "trips"}
                        </div>
                        <div className="font-bold text-black">{previewPercent(settings, trips)}%</div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-neutral-500">
                {settings.loyaltyEnabled
                    ? "Coupons never stack with this — whichever is worth more wins."
                    : "Returning-traveller discounts are off, so nothing is applied. Turn them on under Settings."}
            </p>
        </div>
    );
}
