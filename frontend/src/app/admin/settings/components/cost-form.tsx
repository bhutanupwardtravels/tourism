"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { costSchema, Cost } from "../schema";
import { AnimatedArrowLeft, AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import * as React from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface CostFormProps {
    initialData?: Cost;
    action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
}

export function CostForm({ initialData, action, title: pageTitle }: CostFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<Cost>({
        resolver: zodResolver(costSchema) as any,
        defaultValues: initialData || {
            title: "",
            description: "",
            price: 0,
            type: "fixed",
            isIndianNational: false,
            travelerCategory: "adult",
        },
    });

    const onSubmit = (data: Cost) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("price", String(data.price));
        formData.append("type", data.type);
        formData.append("isIndianNational", String(data.isIndianNational));
        formData.append("travelerCategory", data.travelerCategory);

        startTransition(async () => {
            const result = await action(formData);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/settings");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    const iconRef = React.useRef<AnimatedArrowLeftHandle>(null);

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-6 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Link href="/admin/settings" className="mb-4">
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
                    {pageTitle}
                </h2>
                <p className="text-muted-foreground">Manage global cost settings and Sustainable Development Fees.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g. Sustainable Development Fee (SDF)"
                                                className="bg-white border-gray-200 text-black"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Describe what this fee covers..."
                                                className="min-h-[120px] bg-white border-gray-200 text-black resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Price (USD) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    className="bg-white border-gray-200 text-black"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Charge Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-gray-200 text-black w-full hover:bg-white">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="border-gray-200">
                                                    <SelectItem value="fixed" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Fixed (Once per tour)</SelectItem>
                                                    <SelectItem value="daily" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Daily (Per night)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-[10px] text-zinc-400 italic">
                                                Daily charges are multiplied by the number of tour nights.
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="travelerCategory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Traveler Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-gray-200 text-black w-full hover:bg-white">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="border-gray-200">
                                                    <SelectItem value="adult" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Adult</SelectItem>
                                                    <SelectItem value="child_6_12" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Children (6-12)</SelectItem>
                                                    <SelectItem value="child_under_6" className="focus:bg-zinc-50 focus:text-black cursor-pointer">Children &lt; 6</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isIndianNational"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 h-full pt-6">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-gray-300 shadow-none focus-visible:ring-amber-500"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-medium text-black cursor-pointer">
                                                Indian National
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pb-10">
                                <Button
                                    variant="outline"
                                    type="button"
                                    asChild
                                    className="text-black min-w-[100px]"
                                >
                                    <Link href="/admin/settings">Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-amber-600 hover:bg-amber-700 text-white min-w-[150px] font-medium"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {initialData ? "Update Cost" : "Create Cost"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-none border-amber-100 bg-amber-50/30">
                        <CardContent className="pt-6 space-y-4">
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest border-b border-amber-200 pb-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 bg-amber-600 rounded-full" />
                                Standard SDF Templates
                            </h4>
                            <p className="text-xs text-amber-800/70 mb-4">Quickly fill the form with standard Sustainable Development Fee rates.</p>
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-white text-xs border-amber-200 hover:bg-amber-100 hover:text-amber-900 justify-start h-auto py-3 px-4 flex flex-col items-start gap-1"
                                    onClick={() => {
                                        form.setValue("title", "SDF - International Adult");
                                        form.setValue("price", 100);
                                        form.setValue("type", "daily");
                                        form.setValue("isIndianNational", false);
                                        form.setValue("travelerCategory", "adult");
                                        form.setValue("description", "Sustainable Development Fee for international tourists ($100/night)");
                                    }}
                                >
                                    <span className="font-bold">International Adult</span>
                                    <span className="text-[10px] opacity-70 italic">$100 USD per person / night</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-white text-xs border-amber-200 hover:bg-amber-100 hover:text-amber-900 justify-start h-auto py-3 px-4 flex flex-col items-start gap-1"
                                    onClick={() => {
                                        form.setValue("title", "SDF - Child (6-12)");
                                        form.setValue("price", 50);
                                        form.setValue("type", "daily");
                                        form.setValue("isIndianNational", false);
                                        form.setValue("travelerCategory", "child_6_12");
                                        form.setValue("description", "Sustainable Development Fee for children aged 6-12 ($50/night)");
                                    }}
                                >
                                    <span className="font-bold">Child (Age 6-12)</span>
                                    <span className="text-[10px] opacity-70 italic">$50 USD per person / night</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-white text-xs border-amber-200 hover:bg-amber-100 hover:text-amber-900 justify-start h-auto py-3 px-4 flex flex-col items-start gap-1"
                                    onClick={() => {
                                        form.setValue("title", "SDF - Indian National");
                                        form.setValue("price", 15);
                                        form.setValue("type", "daily");
                                        form.setValue("isIndianNational", true);
                                        form.setValue("travelerCategory", "adult");
                                        form.setValue("description", "Sustainable Development Fee for Indian nationals (INR 1200 ≈ $15/night)");
                                    }}
                                >
                                    <span className="font-bold">Indian National</span>
                                    <span className="text-[10px] opacity-70 italic">INR 1,200 ≈ $15 USD / night</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
