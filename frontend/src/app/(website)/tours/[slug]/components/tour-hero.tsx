"use client";

import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";

interface TourHeroProps {
    title: string;
    image: string;
    category?: string;
    duration?: string;
    price?: number;
}


export function TourHero({
    title,
    image,
    category = "Tours",
    duration,
    price
}: TourHeroProps) {
    const formatPrice = (price?: number) => {
        if (price === undefined) return null;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="h-screen relative overflow-hidden bg-white">
            {/* Background Image with Color Reveal */}
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
            >
                <img src={image} alt={title} className="w-full h-full object-cover saturate-[1.1] contrast-[1.1]" />
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
            </motion.div>

            {/* Animated Light Leak */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
                {/* Background Large Text (Color Accent) */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 0.07, x: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute font-bold text-[20vw] uppercase leading-none tracking-tighter select-none pointer-events-none text-amber-500 whitespace-nowrap"
                >
                    {category}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="relative z-10"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-amber-400 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                    >
                        // exploring: {category}
                    </motion.span>
                    <h1 className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-12 uppercase mix-blend-overlay opacity-90 drop-shadow-2xl">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-12 bg-black/30 backdrop-blur-2xl border border-white/10 p-10 md:p-12 rounded-sm transition-all duration-700">
                        {duration && (
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/60">
                                    <Clock className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Duration</span>
                                    <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">{duration}</span>
                                </div>
                            </div>
                        )}

                        {price !== undefined && (
                            <>
                                <div className="h-16 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/60">
                                        <Tag className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Pricing From</span>
                                        <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">{formatPrice(price)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-12 flex flex-col items-start gap-4"
            >
                <div className="font-mono text-[9px] tracking-[0.3em] text-amber-700/60 uppercase space-y-2">
                    <p className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
                        Kingdom of Bhutan
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                        Official Expeditions
                    </p>
                </div>
                <div className="w-px h-16 bg-linear-to-b from-amber-600/50 to-transparent" />
            </motion.div>
        </div>
    );
}

