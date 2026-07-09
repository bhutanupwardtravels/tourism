"use client";

import * as React from "react";
import { useFieldArray, Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ChevronDown, ChevronUp, GripVertical, MapPin, Clock, ArrowRightLeft, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { Combobox } from "./combobox-wrapper";
import { Tour } from "../schema";

interface DaySectionProps {
    index: number;
    field: any;
    control: Control<Tour>;
    register: UseFormRegister<Tour>;
    setValue: UseFormSetValue<Tour>;
    watch: UseFormWatch<Tour>;
    moveDay: (from: number, to: number) => void;
    removeDay: (index: number) => void;
    totalDays: number;
    experienceOptions: { value: string; label: string; price?: number }[];
    hotelOptions: { value: string; label: string; price?: number }[];
    destinationOptions: { value: string; label: string }[];
    defaultImage?: string;
    onFileSelect: (file: File) => void;
}

export function DaySection({
    index,
    field,
    control,
    register,
    setValue,
    watch,
    moveDay,
    removeDay,
    totalDays,
    experienceOptions,
    hotelOptions,
    destinationOptions,
    defaultImage,
    onFileSelect
}: DaySectionProps) {
    const { fields: itemFields, append: appendItem, remove: removeItem, move: moveItem } = useFieldArray({
        control,
        name: `days.${index}.items` as any,
    });

    return (
        <div className="border border-gray-200 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md text-black">
            <div
                className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between gap-2 select-none"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                    </div>
                    <div className="flex-1">
                        <Input
                            {...register(`days.${index}.title`)}
                            placeholder="Day Title (e.g., Arrival in Paro)"
                            className="bg-transparent border-none font-semibold text-lg p-0 h-9 focus-visible:ring-0 text-black w-full"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => index > 0 && moveDay(index, index - 1)} disabled={index === 0}>
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => index < totalDays - 1 && moveDay(index, index + 1)} disabled={index === totalDays - 1}>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground" onClick={() => removeDay(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-black">Main Description</Label>
                        <Textarea
                            {...register(`days.${index}.description`)}
                            placeholder="Summary of the day's events..."
                            className="min-h-[100px] bg-white border-gray-200 text-black resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            name={`dayImage_${index}`}
                            label="Day Image"
                            defaultPreview={defaultImage}
                            onFileSelect={(file) => onFileSelect(file!)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-black">Planned Sequence</Label>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => appendItem({ type: "experience", order: itemFields.length })}>
                                + Experience
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendItem({ type: "travel", order: itemFields.length, travel: { from: "", to: "" } })}>
                                + Travel
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        {itemFields.map((item, itemIdx) => (
                            <div key={item.id} className="flex gap-2 items-start bg-white p-3 rounded-none border border-gray-200 transition-all group/item">
                                <div className="mt-2 text-gray-300">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    {watch(`days.${index}.items.${itemIdx}.type`) === "experience" ? (
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-amber-50 rounded flex items-center gap-2">
                                                <Star className="h-3.5 w-3.5 text-amber-600" />
                                                <span className="text-[10px] font-bold text-amber-600 uppercase">Curated Experience</span>
                                            </div>
                                            <div className="flex-1">
                                                <Combobox
                                                    options={experienceOptions}
                                                    value={watch(`days.${index}.items.${itemIdx}.experienceId`) || ""}
                                                    onChange={(val) => setValue(`days.${index}.items.${itemIdx}.experienceId` as any, val)}
                                                    placeholder="Link Experience"
                                                    className="h-9 text-xs"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-50 rounded flex items-center gap-2">
                                                <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
                                                <span className="text-[10px] font-bold text-blue-600 uppercase">Transfer Details</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Combobox
                                                        options={destinationOptions}
                                                        value={watch(`days.${index}.items.${itemIdx}.travel.from` as any) || ""}
                                                        onChange={(val) => setValue(`days.${index}.items.${itemIdx}.travel.from` as any, val)}
                                                        placeholder="From"
                                                        className="w-full h-9 text-xs bg-gray-50/50"
                                                    />
                                                    <Combobox
                                                        options={destinationOptions}
                                                        value={watch(`days.${index}.items.${itemIdx}.travel.to` as any) || ""}
                                                        onChange={(val) => setValue(`days.${index}.items.${itemIdx}.travel.to` as any, val)}
                                                        placeholder="To"
                                                        className="h-9 text-xs bg-gray-50/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-0.5 ">
                                    <Button type="button" variant="outline" size="icon" onClick={() => itemIdx > 0 && moveItem(itemIdx, itemIdx - 1)} disabled={itemIdx === 0}>
                                        <ChevronUp className="h-3 w-3" />
                                    </Button>
                                    <Button type="button" variant="outline" size="icon" onClick={() => itemIdx < itemFields.length - 1 && moveItem(itemIdx, itemIdx + 1)} disabled={itemIdx === itemFields.length - 1}>
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                    <Button type="button" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground" size="icon" onClick={() => removeItem(itemIdx)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 space-y-4">
                    <Label className="text-black">Overnight Stay</Label>
                    <div >
                        <div className="flex items-center gap-2">
                            <Combobox
                                options={hotelOptions}
                                value={watch(`days.${index}.hotelId`) || ""}
                                onChange={(val) => setValue(`days.${index}.hotelId` as any, val)}
                                placeholder="Select Hotel"
                            />
                            {(() => {
                                const h = hotelOptions.find(o => o.value === watch(`days.${index}.hotelId`));
                                return h?.price ? <span className="text-xs text-green-600 font-medium">+${h.price}</span> : null;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
