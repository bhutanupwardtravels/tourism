"use client";

import { motion } from "framer-motion";
import { BhutanMap } from "@/components/ui/BhutanMap";
import { ArrowRight } from "lucide-react";

interface TravelMapProps {
    from: string;
    to: string;
    fromCoordinates?: [number, number];
    toCoordinates?: [number, number];
}

export function TravelMap({ from, to, fromCoordinates, toCoordinates }: TravelMapProps) {
    // Only render map if we have at least one set of coordinates, preferably both for the route
    const hasCoordinates = fromCoordinates || toCoordinates;
    const route = fromCoordinates && toCoordinates ? {
        start: fromCoordinates,
        end: toCoordinates
    } : undefined;

    // Fallback coordinates if only one is present (though logic should ensure both or neither ideally)
    const displayCoordinates = fromCoordinates || toCoordinates;

    return (
        <div className="relative w-full aspect-video bg-neutral-100 border border-black/5 rounded-xs overflow-hidden group">
            {/* Map Layer */}
            <div className="absolute inset-0 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000">
                {hasCoordinates ? (
                    <BhutanMap
                        coordinates={displayCoordinates}
                        route={route}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Map Data Unavailable</span>
                    </div>
                )}
            </div>

            {/* Tactical Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-black/10" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-black/10" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-black/10" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-black/10" />
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest block mb-1">Origin</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{from}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-500" />
                        <div>
                            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest block mb-1">Destination</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{to}</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <span className="font-mono text-[9px] text-amber-500 border border-amber-500/30 px-2 py-1 bg-amber-500/10 uppercase tracking-widest">
                            {route ? "Active Route" : "Location Lock"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
