"use client";

import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Clock, ArrowRightLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { Destination } from "@/app/(website)/destinations/schema";
import { getTravelTime } from "@/constants/travel-times";
import { cn } from "@/lib/utils";

interface TravelSelectorProps {
    destinations: Destination[];
    onConfirm: (data: { fromId: string; toId: string; from: string; to: string; duration: number }) => void;
    onCancel: () => void;
}

export function TravelSelector({ destinations, onConfirm, onCancel }: TravelSelectorProps) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (from && to) {
            const fromDest = destinations.find(d => d._id === from);
            const toDest = destinations.find(d => d._id === to);

            if (fromDest && toDest) {
                const cleanFrom = fromDest.name.split(" ")[0];
                const cleanTo = toDest.name.split(" ")[0];
                setDuration(getTravelTime(cleanFrom, cleanTo));
            }
        }
    }, [from, to, destinations]);

    const handleSubmit = () => {
        if (from && to) {
            const fromName = destinations.find(d => d._id === from)?.name || "";
            const toName = destinations.find(d => d._id === to)?.name || "";
            onConfirm({
                fromId: from,
                toId: to,
                from: fromName,
                to: toName,
                duration
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-xs overflow-hidden shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 block mb-2">
                            // logistics
                        </span>
                        <h2 className="text-black text-3xl font-light tracking-tight uppercase">Travel Segment</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400/50" />
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xs appearance-none text-sm font-medium focus:outline-none focus:border-amber-600 transition-colors text-black"
                                >
                                    <option value="">Select Origin</option>
                                    {destinations.map(d => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400/50" />
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xs appearance-none text-sm font-medium focus:outline-none focus:border-amber-600 transition-colors text-black"
                                >
                                    <option value="">Select Destination</option>
                                    {destinations.map(d => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50/50 p-6 rounded-xs border border-amber-100/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Estimated Duration</h4>
                                <p className="text-[10px] text-amber-700/60 uppercase tracking-widest mt-1">based on typical road conditions</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                step="0.5"
                                value={duration}
                                onChange={(e) => setDuration(parseFloat(e.target.value))}
                                className="w-20 bg-white border border-amber-200 rounded-xs px-3 py-2 text-right font-mono text-xl font-bold text-amber-900 focus:outline-none focus:border-amber-600"
                            />
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Hours</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!from || !to}
                        className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-black transition-colors rounded-xs shadow-lg shadow-black/20"
                    >
                        Confirm Segment
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
