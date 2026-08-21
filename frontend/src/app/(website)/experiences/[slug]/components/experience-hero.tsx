"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Clock, Mountain, Calendar } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { formatFestivalDates } from "@/lib/content/festivals";

interface ExperienceHeroProps {
    title: string;
    image: string;
    category: string;
    duration?: string;
    difficulty?: string;
    startDate?: string;
    endDate?: string;
}

export function ExperienceHero({
    title,
    image,
    category,
    duration,
    difficulty,
    startDate,
    endDate
}: ExperienceHeroProps) {
    const dateRange = formatFestivalDates(startDate, endDate);
    return (
        <div className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
            {/* Background Image with Color Reveal */}
            <div className="absolute inset-0">
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover saturate-[1.1] contrast-[1.1]"
                    />
                )}
                {/* Cinematic Overlays - Only fade to white at the very bottom edge */}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
                {/* Flat scrim: the vertical gradient goes fully transparent through
                   the middle of the hero, which is exactly where the headline sits. */}
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Animated Light Leak */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen"
            />

            {/* Background Large Text — decorative tint only. At full amber it
                collided with the headline instead of sitting behind it. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
            >
                {category}
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
                    <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                        {`// exploring: ${category}`}
                    </span>
                    <h1 className="mb-10 text-balance text-[clamp(2.25rem,7vw,5.5rem)] font-light uppercase leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>

                    {/* Hairline gaps over a tinted wrapper, rather than free-standing
                        vertical rules: dividers drawn as siblings dangle in the wrong
                        place the moment the row wraps. */}
                    <div className={`
                        flex w-full flex-wrap gap-px rounded-sm border backdrop-blur-2xl
                        ${category?.toLowerCase() === 'festival' ? 'border-amber-500/40 bg-amber-500/20 shadow-2xl' : 'border-white/10 bg-white/10'}
                    `}>
                        {duration && (
                            <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/50 p-6 text-left md:p-8">
                                <div className={`
                                    w-14 h-14 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500
                                    ${category?.toLowerCase() === 'festival' ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/5'}
                                    group-hover:border-amber-500/60
                                `}>
                                    <Clock className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Duration</span>
                                    <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">{formatDuration(duration)}</span>
                                </div>
                            </div>
                        )}

                        {(category?.toLowerCase() === "culture" || category?.toLowerCase() === "festival" || dateRange) && dateRange && (
                            <>
                                <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/50 p-6 text-left md:p-8">
                                    <div className={`
                                        w-14 h-14 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500
                                        ${category?.toLowerCase() === 'festival' ? 'border-amber-500 bg-amber-500/30 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-white/10 bg-white/5'}
                                        group-hover:border-amber-500/60
                                    `}>
                                        <Calendar className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div className="text-left">
                                        <span className={`
                                            block font-mono text-xs uppercase tracking-widest mb-1
                                            ${category?.toLowerCase() === 'festival' ? 'text-amber-500' : 'text-gray-400'}
                                        `}>Event Dates</span>
                                        <span className={`
                                            font-light tracking-widest text-lg md:text-xl uppercase
                                            ${category?.toLowerCase() === 'festival' ? 'text-amber-400 font-semibold' : 'text-amber-100'}
                                        `}>{dateRange}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {difficulty && (
                            <>
                            <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/50 p-6 text-left md:p-8">
                                <div className={`
                                    w-14 h-14 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500
                                    ${category?.toLowerCase() === 'festival' ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/5'}
                                    group-hover:border-amber-500/60
                                `}>
                                    <Mountain className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Intensity</span>
                                    <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">{difficulty}</span>
                                </div>
                            </div>
                            </>
                        )}
                    </div>
            </div>

            <div className="absolute bottom-12 left-12 z-10 hidden flex-col items-start gap-4 2xl:flex">
                <div className="font-mono text-xs tracking-[0.3em] text-amber-200/80 uppercase space-y-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                    <p className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                        Kingdom of Bhutan
                    </p>
                    <p className="flex items-center gap-2 text-gray-300">
                        Verified Experiences
                    </p>
                </div>
                <div className="w-px h-16 bg-linear-to-b from-amber-500/50 to-transparent" />
            </div>
        </div>
    );
}
