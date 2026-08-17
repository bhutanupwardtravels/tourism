"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PromoSettings, LoyaltyTier } from "@/lib/data/promotions";
import { getPromoSettingsAction, updatePromoSettingsAction } from "./actions";

const emptySettings: PromoSettings = {
    loyaltyEnabled: false,
    tiers: [],
    maxPercent: 15,
    qualifyingStatuses: ["approved"],
    stacking: "best_of",
    teaserText: "",
};

export default function LoyaltyPage() {
    const [settings, setSettings] = useState<PromoSettings>(emptySettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getPromoSettingsAction()
            .then(setSettings)
            .catch(() => toast.error("Failed to load loyalty settings"))
            .finally(() => setIsLoading(false));
    }, []);

    const setField = <K extends keyof PromoSettings>(key: K, value: PromoSettings[K]) =>
        setSettings((prev) => ({ ...prev, [key]: value }));

    const setTier = (index: number, patch: Partial<LoyaltyTier>) =>
        setSettings((prev) => ({
            ...prev,
            tiers: prev.tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
        }));

    const addTier = () => {
        const nextMin = settings.tiers.length
            ? Math.max(...settings.tiers.map((t) => t.minPriorTrips)) + 1
            : 1;
        setField("tiers", [...settings.tiers, { minPriorTrips: nextMin, percent: 2 }]);
    };

    const removeTier = (index: number) =>
        setField(
            "tiers",
            settings.tiers.filter((_, i) => i !== index)
        );

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updatePromoSettingsAction(settings);
        setIsSaving(false);

        if (result.success) {
            toast.success(result.message);
            setSettings((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
        } else {
            toast.error(result.message);
        }
    };

    // Mirrors resolveLoyaltyTier: highest threshold met wins, capped.
    const previewPercent = (trips: number) => {
        if (!settings.loyaltyEnabled || trips <= 0) return 0;
        const earned = settings.tiers
            .filter((t) => trips >= t.minPriorTrips)
            .reduce((best, t) => Math.max(best, t.percent), 0);
        return Math.min(earned, settings.maxPercent);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Returning-Traveller Discount
                </h2>
                <p className="text-sm text-neutral-500">
                    When someone applies using an email that already has approved trips, this
                    discount is applied to their estimate automatically.
                </p>
            </div>

            <Card className="rounded-none border-gray-200">
                <CardContent className="pt-6 space-y-8">
                    <div className="flex items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <Label className="text-black">Enable returning-traveller discounts</Label>
                            <p className="text-sm text-neutral-500 mt-1">
                                Off means no discount is offered or stored, whatever the tiers say.
                            </p>
                        </div>
                        <Switch
                            checked={settings.loyaltyEnabled}
                            onCheckedChange={(v) => setField("loyaltyEnabled", v)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-4">
                            <div className="max-w-2xl">
                                <Label className="text-black">Tiers</Label>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Each row is a threshold, not an exact count: a traveller with 5
                                    previous trips gets the highest tier they qualify for.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addTier}
                                className="rounded-none text-black shrink-0"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add tier
                            </Button>
                        </div>

                        {settings.tiers.length === 0 ? (
                            <p className="text-sm text-neutral-400 border border-dashed border-gray-200 p-6 text-center">
                                No tiers yet. Add one to start rewarding repeat travellers.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {settings.tiers.map((tier, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-500 shrink-0">From</span>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={tier.minPriorTrips}
                                            onChange={(e) =>
                                                setTier(index, { minPriorTrips: Number(e.target.value) })
                                            }
                                            className="w-24 bg-white border-gray-200 text-black"
                                        />
                                        <span className="text-sm text-neutral-500 shrink-0">
                                            previous trip(s), give
                                        </span>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min={0}
                                            value={tier.percent}
                                            onChange={(e) => setTier(index, { percent: Number(e.target.value) })}
                                            className="w-24 bg-white border-gray-200 text-black"
                                        />
                                        <span className="text-sm text-neutral-500 shrink-0">%</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeTier(index)}
                                            className="rounded-none text-red-500 hover:bg-red-50 shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Paired so the width earns its keep — a lone number input in a
                        full-width card leaves a dead gap to its right. */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="space-y-2">
                            <Label className="text-black">Maximum discount (%)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={settings.maxPercent}
                                onChange={(e) => setField("maxPercent", Number(e.target.value))}
                                className="bg-white border-gray-200 text-black"
                            />
                            <p className="text-sm text-neutral-500">
                                A hard ceiling on any single discount — tier or coupon. Nothing can
                                exceed this, so a typo in a tier can&apos;t give away the trip.
                            </p>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <Label className="text-black">Teaser text</Label>
                            <Textarea
                                value={settings.teaserText}
                                onChange={(e) => setField("teaserText", e.target.value)}
                                className="min-h-[80px] bg-white border-gray-200 text-black resize-none"
                            />
                            <p className="text-sm text-neutral-500">
                                Prompts returning travellers to apply with the same email address.
                            </p>
                        </div>
                    </div>

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
                                    <div className="font-bold text-black">{previewPercent(trips)}%</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-500">
                            Coupons never stack with this — whichever is worth more wins.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        {settings.updatedAt && (
                            <span className="text-xs text-neutral-400">
                                Last updated {new Date(settings.updatedAt).toLocaleString()}
                            </span>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="ml-auto bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest h-11 px-6"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
