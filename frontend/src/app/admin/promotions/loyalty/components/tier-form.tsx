"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { AnimatedArrowLeft, AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { loyaltyTierSchema, LoyaltyTierInput } from "../schema";

interface TierFormProps {
    initialData?: LoyaltyTierInput;
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    /** The global ceiling, so the form can warn before a tier is silently clamped. */
    maxPercent: number;
}

export function TierForm({ initialData, action, title: pageTitle, maxPercent }: TierFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    const form = useForm<LoyaltyTierInput>({
        resolver: zodResolver(loyaltyTierSchema),
        defaultValues: initialData ?? { minPriorTrips: 1, percent: 2 },
    });

    const percent = form.watch("percent");
    const minPriorTrips = form.watch("minPriorTrips");
    const exceedsCap = Number.isFinite(percent) && percent > maxPercent;

    const onSubmit = (data: LoyaltyTierInput) => {
        const formData = new FormData();
        formData.append("minPriorTrips", String(data.minPriorTrips));
        formData.append("percent", String(data.percent));

        startTransition(async () => {
            const result = await action(formData);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/promotions/loyalty");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="flex-1 max-w-3xl mx-auto space-y-6 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Link href="/admin/promotions/loyalty" className="mb-4">
                    <Button
                        variant="outline"
                        onMouseEnter={() => iconRef.current?.startAnimation()}
                        onMouseLeave={() => iconRef.current?.stopAnimation()}
                        className="text-black"
                    >
                        <AnimatedArrowLeft ref={iconRef} className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <h2 className="text-2xl font-semibold tracking-tight text-black">{pageTitle}</h2>
                <p className="text-muted-foreground">
                    A tier is a threshold, not an exact count: a traveller gets the highest tier
                    they qualify for, and keeps it on every trip after.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="rounded-none border-gray-200">
                        <CardContent className="pt-6 space-y-8">
                            <FormField
                                control={form.control}
                                name="minPriorTrips"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">
                                            Applies from (previous trips) *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                step="1"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The number of approved trips a traveller needs before this
                                            tier kicks in. Each threshold can only be used once.
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="percent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Discount (%) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                min={0}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Taken off the estimate automatically when the traveller
                                            applies with an email that already has approved trips.
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {exceedsCap && (
                                <p className="border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800">
                                    The maximum discount is currently {maxPercent}%, so this tier will
                                    only ever give {maxPercent}%. Raise the ceiling under Settings to
                                    let the full {percent}% through.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-neutral-400">
                            {Number.isFinite(minPriorTrips) && Number.isFinite(percent)
                                ? `A traveller with ${minPriorTrips} previous trip${
                                      minPriorTrips === 1 ? "" : "s"
                                  } gets ${Math.min(percent, maxPercent)}% off.`
                                : null}
                        </span>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest h-11 px-6"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Tier
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
