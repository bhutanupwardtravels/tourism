"use client";

import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TourRequest } from "../../types";

interface CustomItineraryViewProps {
    request: TourRequest;
}

export function CustomItineraryView({ request }: CustomItineraryViewProps) {
    const { customItinerary } = request;

    if (!customItinerary || customItinerary.length === 0) return null;

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-2xl font-semibold text-black tracking-tight">Custom Itinerary</h3>
                <Badge variant="outline" className="rounded-none border-gray-200 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                    {customItinerary.length} Days
                </Badge>
            </div>
            <div className="space-y-16">
                {customItinerary.map((day) => (
                    <div key={day.day} className="relative group">
                        <div className="flex gap-12">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border border-black text-black flex items-center justify-center font-bold text-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] mb-4">
                                    {day.day < 10 ? `0${day.day}` : day.day}
                                </div>
                                <div className="w-px h-full bg-gray-100 flex-1" />
                            </div>

                            <div className="flex-1 space-y-8 pb-12">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold uppercase tracking-widest text-black">Day {day.day}</h4>
                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{day.items.length} Activities</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {day.items.map((item, idx) => (
                                        <div key={idx} className="relative group/item overflow-hidden">
                                            {item.type === "experience" ? (
                                                <div className="border border-gray-100 p-6 bg-white hover:border-amber-200 transition-colors rounded-none shadow-xs">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 block">
                                                            Experience
                                                        </span>
                                                        <Clock className="w-3 h-3 text-gray-300" />
                                                    </div>
                                                    <div className="text-sm font-bold text-black uppercase tracking-tight mb-2">{item.experience?.title}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {item.experience?.duration || "Duration N/A"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="border border-gray-100 p-6 bg-white hover:border-blue-200 transition-colors rounded-none shadow-xs">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block">
                                                            Transfer
                                                        </span>
                                                        <MapPin className="w-3 h-3 text-gray-300" />
                                                    </div>
                                                    <div className="text-sm font-bold text-black uppercase tracking-tight mb-2 flex items-center gap-3">
                                                        {item.travel?.from} <span className="text-gray-200">→</span> {item.travel?.to}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {item.travel?.duration} Hours
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
