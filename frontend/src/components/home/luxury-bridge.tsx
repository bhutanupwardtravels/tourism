"use client";

import { Reveal } from "@/components/ui/reveal";
export function LuxuryBridge() {
    return (
        <section className="py-40 md:py-80 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <Reveal y={20} duration={1.5}
                    className="max-w-4xl mx-auto">
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.8em] mb-12 block">
            {"// Palate Cleanser"}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-black leading-tight">
                        Curated Expeditions for the <br />
                        <span className="italic font-serif normal-case text-amber-600">Discerning Traveler</span>
                    </h2>
                    <div className="mt-16 flex justify-center items-center gap-4">
                        <div className="w-12 h-px bg-black/5" />
                        <div className="w-1.5 h-1.5 rounded-full border border-amber-600/30" />
                        <div className="w-12 h-px bg-black/5" />
                    </div>
                </Reveal>
            </div>

            {/* Subtle Background Markings */}
            <div aria-hidden className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                <span className="font-mono text-6xl font-bold uppercase tracking-tighter text-black">
                    Excellence
                </span>
            </div>
        </section>
    );
}
