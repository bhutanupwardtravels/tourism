"use client";

import { motion } from "framer-motion";
import { BhutanMap } from "@/components/ui/BhutanMap";

interface LocationMapProps {
    name: string;
    coordinates: [number, number];
    title?: string;
    subtitle?: string;
}

export function LocationMap({ name, coordinates, title = "Map Location", subtitle = "// location details" }: LocationMapProps) {
    return (
        <section className="py-40 bg-white relative overflow-hidden">
            {/* Tactical Background Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern
                        id="tacticalGrid"
                        width="50"
                        height="50"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 50 0 L 0 0 0 50"
                            fill="none"
                            stroke="black"
                            strokeWidth="0.2"
                        />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#tacticalGrid)" />
                </svg>
            </div>

            {/* Pulsing Radar Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-amber-500/5 rounded-full animate-pulse delay-500 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="block font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4"
                    >
                        {subtitle}
                    </motion.span>
                    <h2 className="text-5xl md:text-7xl font-light text-black tracking-tighter uppercase whitespace-nowrap">
                        {title.split(' ')[0]} <span className="italic font-serif normal-case text-amber-600">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>

                <div className="relative aspect-video lg:aspect-21/9 bg-neutral-100 border border-black/5 rounded-sm overflow-hidden flex items-center justify-center p-12 group transition-all duration-700 hover:border-amber-500/20">
                    {/* Scanning Line Effect */}
                    <motion.div
                        animate={{ top: ["100%", "-10%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-600/30 to-transparent z-10"
                    />

                    {/* Map Component */}
                    <div className="w-full h-full relative z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-1000 grayscale brightness-100 group-hover:grayscale-0">
                        <BhutanMap highlightDestination={name.toLowerCase()} coordinates={coordinates} />
                    </div>

                    {/* Tactical Overlay UI */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Corner brackets */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-black/20" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-black/20" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-black/20" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-black/20" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute bottom-12 right-12 bg-white/80 backdrop-blur-xl px-8 py-4 border border-black/10 z-20"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-amber-600 rounded-full animate-ping" />
                                <span className="font-mono text-[10px] tracking-widest text-black uppercase">{name}</span>
                            </div>
                            <div className="h-px w-full bg-black/5 my-1" />
                            <span className="font-mono text-[9px] text-amber-600/60 tracking-wider">
                                LOCATION: {coordinates[0].toFixed(4)}°N, {coordinates[1].toFixed(4)}°E
                            </span>
                        </div>
                    </motion.div>

                    <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-12 pointer-events-none">
                        <div className="space-y-1">
                            <p className="font-mono text-[8px] text-black/20 uppercase tracking-widest">Information View</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-black/20 rounded-full" />)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="font-mono text-[8px] text-black/20 uppercase tracking-widest">Status</p>
                            <p className="font-mono text-[10px] text-black/40">CONNECTION ACTIVE</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-between items-center text-gray-500 font-mono text-[9px] tracking-widest uppercase">
                    <span>Location Data: 100% Verified</span>
                    <span className="animate-pulse">Kingdom of Happiness...</span>
                </div>
            </div>
        </section>
    );
}
