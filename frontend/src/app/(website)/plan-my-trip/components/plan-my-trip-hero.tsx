"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Rendered both inside PlanMyTripClient and as the Suspense fallback in
// page.tsx — it doesn't read searchParams, so it always server-renders
// even while PlanMyTripClient (which does) is deferred to the client.
export function PlanMyTripHero() {
    return (
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/images/Bhutan-Travel-Guide.jpg"
                    alt="Bhutanese Aerial Landscape"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <span className="font-mono text-amber-600 text-xs font-bold tracking-[0.6em] uppercase block mb-8">
                        // kingdom of happiness
                    </span>
                    <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-white mb-12 uppercase leading-none">
                        Plan Your <br />
                        <span className="italic font-serif normal-case text-amber-600">Bhutan Trip</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed italic">
                        Decide between our curated collections or craft a custom narrative tailored to your personal frequency.
                    </p>
                </motion.div>
            </div>

            {/* Vertical Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white">Begin Journey</span>
                <div className="w-px h-12 bg-white/20 overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 48, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-1/2 bg-amber-600"
                    />
                </div>
            </motion.div>
        </section>
    );
}
