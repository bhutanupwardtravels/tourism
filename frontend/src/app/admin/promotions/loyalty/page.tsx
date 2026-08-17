import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getPromoSettingsAction } from "./actions";
import { TiersTable } from "./components/tiers-table";
import { LoyaltyPreview } from "./components/loyalty-preview";
import { LoyaltyTierRow } from "./schema";

export const metadata: Metadata = { title: "Returning-Traveller Discount" };

interface LoyaltyPageProps {
    searchParams: Promise<{ minPriorTrips?: string }>;
}

export default async function LoyaltyPage({ searchParams }: LoyaltyPageProps) {
    const [settings, params] = await Promise.all([getPromoSettingsAction(), searchParams]);

    // DataTable runs with manualFiltering, so the toolbar's search only writes to
    // the URL — the filtering itself belongs here.
    const search = (params.minPriorTrips || "").trim();

    const rows: LoyaltyTierRow[] = settings.tiers
        .filter((tier) => !search || String(tier.minPriorTrips).includes(search))
        .map((tier) => ({
            ...tier,
            effectivePercent: Math.min(tier.percent, settings.maxPercent),
            capped: tier.percent > settings.maxPercent,
        }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-black">
                        Returning-Traveller Discount
                    </h2>
                    <Badge
                        variant="outline"
                        className={
                            settings.loyaltyEnabled
                                ? "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200"
                        }
                    >
                        {settings.loyaltyEnabled ? "On" : "Off"}
                    </Badge>
                </div>
                <p className="text-sm text-neutral-500">
                    When someone applies using an email that already has approved trips, this
                    discount is applied to their estimate automatically. Each tier is a threshold —
                    a traveller gets the highest one they qualify for, capped at{" "}
                    {settings.maxPercent}%.
                </p>
            </div>

            <TiersTable data={rows} />

            <LoyaltyPreview settings={settings} />
        </div>
    );
}
