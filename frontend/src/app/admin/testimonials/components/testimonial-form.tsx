"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Loader2, Star, Pencil } from "lucide-react";
import Link from "next/link";
import { Testimonial } from "../schema";
import { AnimatedArrowLeft, type AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { ImageUpload } from "@/components/admin/image-upload";
import { cn } from "@/lib/utils";

interface TestimonialFormProps {
    initialData?: Testimonial;
    action?: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    isReadOnly?: boolean;
}

export function TestimonialForm({ initialData, action, title, isReadOnly = false }: TestimonialFormProps) {
    const router = useRouter();
    const iconRef = useRef<AnimatedArrowLeftHandle>(null);
    const [state, formAction, isPending] = useActionState(action || (async () => ({ success: false, message: "" })), {
        success: false,
        message: "",
    });

    const [rating, setRating] = useState(initialData?.rating ?? 5);
    const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? true);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            router.push("/admin/testimonials");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state.success, state.message, router]);

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-4 md:p-8 pt-6 relative">
            {isReadOnly && (
                <Link
                    href={`/admin/testimonials/${initialData?.id || initialData?._id}/edit`}
                    className="fixed top-24 right-8 z-50"
                >
                    <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                        <Pencil className="w-5 h-5" />
                    </Button>
                </Link>
            )}
            <div className="flex flex-col gap-2">
                <Link href="/admin/testimonials" className="mb-4">
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
                <h2 className="text-2xl font-semibold tracking-tight text-black">{title}</h2>
            </div>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="rating" value={rating} />
                <input type="hidden" name="isFeatured" value={isFeatured ? "true" : "false"} />

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-black">Traveler Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={initialData?.name}
                            placeholder="e.g. Sarah Jenkins"
                            required
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-black">Role / Location</Label>
                        <Input
                            id="role"
                            name="role"
                            defaultValue={initialData?.role}
                            placeholder="e.g. Traveler from USA"
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quote" className="text-black">Testimonial *</Label>
                    <Textarea
                        id="quote"
                        name="quote"
                        defaultValue={initialData?.quote}
                        placeholder="Share what the traveler said about their trip..."
                        required
                        readOnly={isReadOnly}
                        className="min-h-[150px] bg-white border-gray-200 text-black"
                        rows={5}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-black font-semibold">Rating</Label>
                        <div className="flex items-center gap-1 h-10">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() => setRating(value)}
                                    className={cn("p-0.5", isReadOnly ? "cursor-default" : "cursor-pointer")}
                                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                                >
                                    <Star
                                        className={cn(
                                            "w-6 h-6 transition-colors",
                                            value <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                                        )}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-xs text-gray-400 font-mono">{rating}/5</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-black">
                            Priority <span className="text-xs text-gray-500 font-normal">(Higher Value = Higher Priority)</span>
                        </Label>
                        <Input
                            id="priority"
                            name="priority"
                            type="number"
                            min="0"
                            placeholder="0"
                            defaultValue={initialData?.priority ?? 0}
                            readOnly={isReadOnly}
                            className="bg-white border-gray-200 text-black"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-black font-semibold">Show on Website</Label>
                        <p className="text-xs text-gray-500">
                            Featured testimonials appear in the homepage carousel, ordered by priority.
                        </p>
                    </div>
                    <Switch
                        checked={isFeatured}
                        onCheckedChange={setIsFeatured}
                        disabled={isReadOnly}
                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                    />
                </div>

                <ImageUpload
                    defaultPreview={initialData?.avatar}
                    name="avatar"
                    label="Photo"
                    readOnly={isReadOnly}
                />

                {!isReadOnly && (
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/testimonials">
                            <Button type="button" variant="outline" className="text-black">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-amber-600 text-white hover:bg-amber-700 min-w-[150px] font-medium"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {initialData ? "Update Testimonial" : "Create Testimonial"}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
