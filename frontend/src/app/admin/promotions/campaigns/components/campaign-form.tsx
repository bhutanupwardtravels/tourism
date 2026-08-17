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
import { campaignSchema, PromoCampaign } from "../schema";

/** ISO instant -> the local wall-clock string <input type="datetime-local"> wants. */
function toLocalInput(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface CampaignFormProps {
    initialData?: PromoCampaign;
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
}

export function CampaignForm({ initialData, action, title: pageTitle }: CampaignFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    const form = useForm<PromoCampaign>({
        resolver: zodResolver(campaignSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  bannerStartsAt: toLocalInput(initialData.bannerStartsAt),
                  bannerEndsAt: toLocalInput(initialData.bannerEndsAt),
              }
            : {
                  name: "",
                  codePrefix: "BHU",
                  discountPercent: 5,
                  bannerHeadline: "Your Bhutan journey, 5% lighter",
                  bannerBody:
                      "Leave your details and we'll send you a discount code to use whenever you're ready to travel.",
                  bannerCtaLabel: "Claim your code",
                  bannerStartsAt: "",
                  bannerEndsAt: "",
                  couponValidDays: 180,
                  couponEligibleAfterDays: 0,
                  maxIssued: null,
                  isActive: true,
                  priority: 0,
              },
    });

    const onSubmit = (data: PromoCampaign) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("codePrefix", data.codePrefix);
        formData.append("discountPercent", String(data.discountPercent));
        formData.append("bannerHeadline", data.bannerHeadline);
        formData.append("bannerBody", data.bannerBody || "");
        formData.append("bannerCtaLabel", data.bannerCtaLabel);
        formData.append("bannerStartsAt", data.bannerStartsAt || "");
        formData.append("bannerEndsAt", data.bannerEndsAt || "");
        formData.append("couponValidDays", String(data.couponValidDays));
        formData.append("couponEligibleAfterDays", String(data.couponEligibleAfterDays));
        formData.append("maxIssued", data.maxIssued != null ? String(data.maxIssued) : "");
        formData.append("isActive", String(data.isActive));
        formData.append("priority", String(data.priority));

        startTransition(async () => {
            const result = await action(formData);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/promotions/campaigns");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-6 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Link href="/admin/promotions/campaigns" className="mb-4">
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
                    Control what the banner says, how long it runs, and how long the codes it issues
                    stay usable.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Campaign name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Autumn 2026 lead capture"
                                            className="bg-white border-gray-200 text-black"
                                        />
                                    </FormControl>
                                    <FormDescription>Internal only — never shown to visitors.</FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bannerHeadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Banner headline *</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white border-gray-200 text-black" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bannerBody"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Banner body</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="min-h-[100px] bg-white border-gray-200 text-black resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="bannerCtaLabel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Button label *</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white border-gray-200 text-black" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPercent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Discount % *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="bannerStartsAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Banner starts</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                                value={field.value ?? ""}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormDescription>Leave blank to start immediately.</FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bannerEndsAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Banner ends</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                                value={field.value ?? ""}
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormDescription>Leave blank to run until paused.</FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-none border-gray-200">
                            <CardContent className="pt-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between gap-4">
                                            <div>
                                                <FormLabel className="text-black">Active</FormLabel>
                                                <FormDescription>
                                                    Off hides the banner immediately, whatever the dates say.
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
                                    name="codePrefix"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Code prefix *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    className="bg-white border-gray-200 text-black font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Codes look like <span className="font-mono">{form.watch("codePrefix") || "BHU"}-7F3K9Q</span>.
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="couponValidDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Code valid for (days) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="couponEligibleAfterDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Redeemable after (days)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Leave at 0 unless you have a reason. A waiting period reliably
                                                suppresses redemptions from people ready to book today.
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxIssued"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Max codes</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={field.value ?? ""}
                                                    onChange={(e) =>
                                                        field.onChange(e.target.value ? Number(e.target.value) : null)
                                                    }
                                                    placeholder="Unlimited"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Priority</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Highest wins when several campaigns are live at once.
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest h-11"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Campaign
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
