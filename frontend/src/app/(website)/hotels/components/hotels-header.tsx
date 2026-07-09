"use client";

import { motion } from "framer-motion";

export function HotelsHeader() {
    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white">
            {/* Background Cinematic Text */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.03, scale: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 flex items-center justify-center font-bold text-[40vw] uppercase leading-none tracking-tighter select-none pointer-events-none text-black"
            >
                Stay
            </motion.div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] mb-6 block font-bold">
            // the hospitality record
                    </span>
                    <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-none mb-8 uppercase text-black">
                        Sanctuaries <br />
                        <span className="italic font-serif normal-case opacity-40">of the</span> Kingdom
                    </h1>

                    <div className="flex items-center justify-center gap-8 mt-12">
                        <div className="h-px w-12 bg-black/10" />
                        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-400">Verified Accommodations // 2025</p>
                        <div className="h-px w-12 bg-black/10" />
                    </div>
                </motion.div>
            </div>

            {/* Animated Light Leak */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/10 blur-[120px] rounded-full mix-blend-multiply"
            />
        </section>
    );
}
