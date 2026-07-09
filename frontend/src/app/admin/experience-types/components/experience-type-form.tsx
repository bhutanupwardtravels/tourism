"use client";

import { useActionState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { ExperienceType } from "../schema";
import { generateSlug } from "@/utils/slug-generator";
import { AnimatedArrowLeft, type AnimatedArrowLeftHandle } from "@/components/ui/animated-arrow-left";
import { ImageUpload } from "@/components/admin/image-upload";
import { Pencil } from "lucide-react";

interface ExperienceTypeFormProps {
    initialData?: ExperienceType;
    action?: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
    title: string;
    isReadOnly?: boolean;
}

export function ExperienceTypeForm({ initialData, action, title, isReadOnly = false }: ExperienceTypeFormProps) {
    const router = useRouter();
    const iconRef = useRef<AnimatedArrowLeftHandle>(null);
    const [state, formAction, isPending] = useActionState(action || (async () => ({ success: false, message: "" })), {
        success: false,
        message: "",
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            router.push("/admin/experience-types");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state.success, state.message, router]);

    return (
        <div className="flex-1 max-w-7xl mx-auto space-y-4 md:p-8 pt-6 relative">
            {isReadOnly && (
                <Link
                    href={`/admin/experience-types/${initialData?._id || initialData?.slug}/edit`}
                    className="fixed top-24 right-8 z-50"
                >
                    <Button className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center transition-transform hover:scale-110">
                        <Pencil className="w-5 h-5" />
                    </Button>
                </Link>
            )}
            <div className="flex flex-col gap-2">
                <Link href="/admin/experience-types" className="mb-4">
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

            <div>
                <form action={formAction} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-black">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={initialData?.title}
                                placeholder="e.g. Wellness & Rejuvenation"
                                required
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black"
                                onChange={(e) => {
                                    const slugInput = document.getElementById('slug') as HTMLInputElement;
                                    if (slugInput) {
                                        slugInput.value = generateSlug(e.target.value);
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-black">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={initialData?.slug}
                                placeholder="e.g. wellness"
                                required
                                className="text-black bg-gray-100 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayOrder" className="text-black">Priority <span className="text-xs text-gray-500 font-normal">(Higher Value = Higher Priority)</span></Label>
                            <Input
                                id="displayOrder"
                                name="displayOrder"
                                type="number"
                                defaultValue={initialData?.displayOrder || 0}
                                placeholder="0"
                                readOnly={isReadOnly}
                                className="bg-white border-gray-200 text-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-black">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description}
                            placeholder="Describe this experience type..."
                            required
                            readOnly={isReadOnly}
                            className="min-h-[150px] bg-white border-gray-200 text-black"
                            rows={5}
                        />
                    </div>

                    <ImageUpload
                        defaultPreview={initialData?.image}
                        required={!initialData}
                        name="image"
                        label="Cover Image *"
                        readOnly={isReadOnly}
                    />

                    {!isReadOnly && (
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/experience-types">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-black"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-amber-600 text-white hover:bg-amber-700 min-w-[120px]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {initialData ? "Update Experience Type" : "Create Experience Type"}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
