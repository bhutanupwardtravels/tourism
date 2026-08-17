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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { updateLoyaltySettingsAction } from "../actions";
import { loyaltySettingsSchema, LoyaltySettingsInput } from "../schema";

interface SettingsFormProps {
    initialData: LoyaltySettingsInput;
    updatedAt?: string;
}

export function LoyaltySettingsForm({ initialData, updatedAt }: SettingsFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    const form = useForm<LoyaltySettingsInput>({
        resolver: zodResolver(loyaltySettingsSchema),
        defaultValues: initialData,
    });

    const onSubmit = (data: LoyaltySettingsInput) => {
        const formData = new FormData();
        formData.append("loyaltyEnabled", String(data.loyaltyEnabled));
        formData.append("maxPercent", String(data.maxPercent));
        formData.append("teaserText", data.teaserText);

        startTransition(async () => {
            const result = await updateLoyaltySettingsAction(formData);
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
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Loyalty Settings
                </h2>
                <p className="text-muted-foreground">
                    The rules that sit above every tier — whether the discount runs at all, how far
                    it can go, and what returning travellers are told.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="rounded-none border-gray-200">
                        <CardContent className="pt-6 space-y-8">
                            <FormField
                                control={form.control}
                                name="loyaltyEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
                                        <div className="space-y-1">
                                            <FormLabel className="text-black">
                                                Enable returning-traveller discounts
                                            </FormLabel>
                                            <FormDescription>
                                                Off means no discount is offered or stored, whatever
                                                the tiers say.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxPercent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">
                                            Maximum discount (%) *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A hard ceiling on any single discount — tier or coupon.
                                            Nothing can exceed this, so a typo in a tier can&apos;t give
                                            away the trip.
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="teaserText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Teaser text</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[100px] bg-white border-gray-200 text-black resize-none"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Prompts returning travellers to apply with the same email
                                            address.
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between gap-4">
                        {updatedAt && (
                            <span className="text-xs text-neutral-400">
                                Last updated {new Date(updatedAt).toLocaleString()}
                            </span>
                        )}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="ml-auto bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest h-11 px-6"
                        >
                            {isPending ? (
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
                </form>
            </Form>
        </div>
    );
}
