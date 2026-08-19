"use client";

import { motion } from "framer-motion";
import { BhutanMap } from "@/components/ui/BhutanMap";
import { Reveal } from "@/components/ui/reveal";

interface LocationMapProps {
    name: string;
    coordinates?: [number, number] | null;
    title?: string;
    subtitle?: string;
}

export function LocationMap({ name, coordinates, title = "Map Location", subtitle = "// location details" }: LocationMapProps) {
    if (!coordinates) return null;

    return (
        <section className="py-20 md:py-40 bg-white relative overflow-hidden">
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

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12 md:mb-24">
                    <Reveal as="span" y={0}
                        className="block font-mono text-amber-600 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4">
                        {subtitle}
                    </Reveal>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-light text-black tracking-tighter uppercase">
                        {title.split(' ')[0]} <span className="italic font-serif normal-case text-amber-600">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>

                <div className="relative aspect-4/3 sm:aspect-video lg:aspect-21/9 bg-neutral-100 border border-black/5 rounded-sm overflow-hidden flex items-center justify-center p-4 sm:p-8 md:p-12 group transition-all duration-700 hover:border-amber-500/20">
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
                        <div className="absolute top-3 left-3 md:top-8 md:left-8 w-6 h-6 md:w-12 md:h-12 border-t border-l border-black/20" />
                        <div className="absolute top-3 right-3 md:top-8 md:right-8 w-6 h-6 md:w-12 md:h-12 border-t border-r border-black/20" />
                        <div className="absolute bottom-3 left-3 md:bottom-8 md:left-8 w-6 h-6 md:w-12 md:h-12 border-b border-l border-black/20" />
                        <div className="absolute bottom-3 right-3 md:bottom-8 md:right-8 w-6 h-6 md:w-12 md:h-12 border-b border-r border-black/20" />
                    </div>

                    <Reveal y={0} scale={0.8}
                        className="absolute bottom-3 right-3 md:bottom-12 md:right-12 max-w-[calc(100%-1.5rem)] bg-white/80 backdrop-blur-xl px-4 py-3 md:px-8 md:py-4 border border-black/10 z-20">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 shrink-0 bg-amber-600 rounded-full animate-ping" />
                                <span className="font-mono text-xs tracking-widest text-black uppercase truncate">{name}</span>
                            </div>
                            <div className="h-px w-full bg-black/5 my-1" />
                            <span className="font-mono text-xs text-amber-600/60 tracking-wider">
                                {coordinates[0].toFixed(4)}°N, {coordinates[1].toFixed(4)}°E
                            </span>
                        </div>
                    </Reveal>

                </div>

                <div className="mt-6 md:mt-12 flex flex-wrap justify-between items-center gap-2 text-gray-500 font-mono text-xs tracking-widest uppercase">
                    <span>Approximate location</span>
                    <span className="animate-pulse">Kingdom of Happiness...</span>
                </div>
            </div>
        </section>
    );
}
