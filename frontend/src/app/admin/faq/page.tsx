"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFaqContentAction, updateFaqContentAction } from "./actions";
import { FaqContent, FaqEntry } from "@/lib/data/faq";

const emptyContent: FaqContent = { items: [] };

function emptyEntry(): FaqEntry {
    return { question: "", answer: "", homepage: false };
}

export default function FaqPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<FaqContent>(emptyContent);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getFaqContentAction();
                setFormData(data);
            } catch (error) {
                toast.error("Failed to load FAQ content");
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const updateItem = (index: number, patch: Partial<FaqEntry>) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
        }));
    };

    const removeItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const addItem = () => {
        setFormData((prev) => ({ ...prev, items: [...prev.items, emptyEntry()] }));
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const result = await updateFaqContentAction(formData);
            if (result.success) {
                toast.success(result.message);
                setFormData((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64 rounded-none bg-gray-200" />
                    <Skeleton className="h-4 w-96 rounded-none bg-gray-200" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-none bg-gray-200" />
                    <Skeleton className="h-48 w-full rounded-none bg-gray-200" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-black">FAQ</h2>
                    <p className="text-sm text-neutral-500">
                        Manage the questions shown on the Bhutan Travel Guide page and the homepage FAQ block.
                        {formData.updatedAt && (
                            <span className="block sm:inline sm:ml-2 text-xs text-neutral-400">
                                Last updated {format(new Date(formData.updatedAt), "MMM d, yyyy 'at' HH:mm")}
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-none bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="space-y-4">
                {formData.items.map((item, index) => (
                    <Card key={index} className="rounded-none">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <GripVertical className="w-4 h-4 text-neutral-300 mt-2.5 shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Question</Label>
                                        <Input
                                            value={item.question}
                                            onChange={(e) => updateItem(index, { question: e.target.value })}
                                            placeholder="e.g. Do I need a visa to visit Bhutan?"
                                            className="rounded-none text-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Answer</Label>
                                        <Textarea
                                            value={item.answer}
                                            onChange={(e) => updateItem(index, { answer: e.target.value })}
                                            placeholder="Keep it self-contained: a reader should understand the answer without any other context."
                                            rows={4}
                                            className="rounded-none text-black"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={item.homepage}
                                                onCheckedChange={(checked) => updateItem(index, { homepage: checked })}
                                            />
                                            <Label className="text-black">Show on homepage</Label>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeItem(index)}
                                            className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="rounded-none border-black/10 text-black hover:bg-black/5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                </Button>
            </div>
        </form>
    );
}
