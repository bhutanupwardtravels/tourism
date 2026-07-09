"use client";

import { motion } from "framer-motion";

interface DayHeroProps {
    dayNumber: number;
    title: string;
    image: string;
    tourTitle: string;
}

export function DayHero({ dayNumber, title, image, tourTitle }: DayHeroProps) {
    return (
        <section className="h-[70vh] relative overflow-hidden bg-white">
            {/* Background Image with Reveal */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover saturate-[0.7] brightness-[1.05]"
                />
                {/* Cinematic Overlays - Light Theme */}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
            </motion.div>

            <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative z-10">
                <div className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex items-center gap-6 mb-8"
                    >
                        <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.5em] font-bold">
              // day {dayNumber < 10 ? `0${dayNumber}` : dayNumber} : {tourTitle}
                        </span>
                        <span className="h-px w-12 bg-black/10" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-6xl md:text-8xl font-light tracking-tighter leading-none mb-4 uppercase text-white"
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex items-center gap-4"
                    >
                        <span className="font-mono text-[11px] text-white uppercase tracking-widest bg-black/5 px-4 py-1.5 rounded-full font-bold">
                            Route Sequence Verified
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Decorative ID */}
            <div className="absolute top-48 right-12 hidden lg:block">
                <span className="font-mono text-[10px] text-white uppercase tracking-[0.8em] writing-mode-vertical-rl rotate-180 opacity-70 font-bold">
                    LOG // BHU-DAY-{dayNumber}
                </span>
            </div>
        </section>
    );
}
