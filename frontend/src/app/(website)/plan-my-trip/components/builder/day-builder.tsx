"use client";

import { ArrowRightLeft, Clock, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { DayItinerary, ItineraryItem } from "@/app/admin/tour-requests/types";
import { cn } from "@/lib/utils";

interface DayBuilderProps {
    day: DayItinerary;
    totalHours: number;
    isValid: boolean;
    hasHotel: boolean;
    onAddExperience: () => void;
    onAddTravel: () => void;
    onAddHotel: () => void;
    onRemoveItem: (itemId: string) => void;
    onReorder: (items: ItineraryItem[]) => void;
}

export function DayBuilder({
    day,
    totalHours,
    isValid,
    hasHotel,
    onAddExperience,
    onAddTravel,
    onAddHotel,
    onRemoveItem,
    onReorder
}: DayBuilderProps) {

    return (
        <div className="border border-gray-200 rounded-xs overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-mono text-lg font-bold">
                        {day.day}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-tight text-black">Day {day.day} Activity</h3>
                        <p className="text-xs text-gray-500 font-medium">Build your sequence of events</p>
                    </div>
                </div>

                <div className={cn(
                    "px-4 py-2 rounded-full border flex items-center gap-3",
                    isValid ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                )}>
                    <Clock className={cn("w-4 h-4", isValid ? "text-gray-400" : "text-red-500")} />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Duration</span>
                        <span className={cn("font-mono font-bold", isValid ? "text-black" : "text-red-500")}>
                            {totalHours} / 18 HRS
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                <Reorder.Group axis="y" values={day.items} onReorder={onReorder} className="space-y-3">
                    {day.items.map((item) => (
                        <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing">
                            <div className="bg-white text-black border border-gray-100 rounded-xs p-4 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-colors">
                                {/* Icon */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    item.type === "experience" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    {item.type === "experience" ? <Star className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    {item.type === "experience" ? (
                                        <>
                                            <h4 className="font-bold text-sm uppercase truncate">{item.experience?.title}</h4>
                                            <p className="text-xs text-gray-500 truncate">{item.experience?.duration || "Flexible Duration"}</p>
                                        </>
                                    ) : item.hotelId ? (
                                        <>
                                            <h4 className="font-bold text-sm uppercase truncate">{item.hotel?.name}</h4>
                                            <p className="text-xs text-gray-500 truncate">Accommodation</p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-sm uppercase flex items-center gap-2">
                                                {item.travel?.from} <span className="text-gray-300">→</span> {item.travel?.to}
                                            </h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> {item.travel?.duration} HRS
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {day.items.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-lg p-8 text-center bg-gray-50/50">
                        <p className="text-xs uppercase tracking-widest text-gray-400">Time is empty. Fill it with wonder.</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={onAddExperience}
                        disabled={hasHotel}
                        className={cn(
                            "flex items-center justify-center gap-2 py-3 border border-dashed border-amber-200 bg-amber-50/30 text-amber-700 rounded hover:bg-amber-50 transition-colors text-xs font-bold uppercase tracking-wider",
                            hasHotel && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Plus className="w-4 h-4" /> Activity
                    </button>
                    <button
                        onClick={onAddTravel}
                        disabled={hasHotel}
                        className={cn(
                            "flex items-center justify-center gap-2 py-3 border border-dashed border-blue-200 bg-blue-50/30 text-blue-700 rounded hover:bg-blue-50 transition-colors text-xs font-bold uppercase tracking-wider",
                            hasHotel && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Plus className="w-4 h-4" /> Move to...
                    </button>
                    <button
                        onClick={onAddHotel}
                        disabled={hasHotel}
                        className={cn(
                            "flex items-center justify-center gap-2 py-3 border border-dashed border-purple-200 bg-purple-50/30 text-purple-700 rounded hover:bg-purple-50 transition-colors text-xs font-bold uppercase tracking-wider",
                            hasHotel && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Plus className="w-4 h-4" /> Hotel
                    </button>
                </div>
            </div>
        </div>
    );
}
