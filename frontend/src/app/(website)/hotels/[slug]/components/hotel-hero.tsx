"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { MapPin, Star, BedDouble } from "lucide-react";

interface HotelHeroProps {
    name: string;
    image: string;
    location?: string;
    rating: number;
    priceRange: string;
    rooms?: number;
    price?: number;
}

export function HotelHero({ name, image, location, rating, priceRange, rooms, price }: HotelHeroProps) {
    const nightlyRate =
        price === undefined
            ? null
            : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
              }).format(price);

    // Same shell as the tour, experience and day heroes: 90vh floor, top padding
    // that clears the fixed header, and the stat-tile row underneath the
    // headline. This page used to centre its content over a 72vh banner, which
    // read as a different site the moment you stepped across from a tour.
    return (
        <div className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
            {/* Background Image with Color Reveal */}
            <div className="absolute inset-0">
                {image && (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover saturate-[1.1] contrast-[1.1]"
                    />
                )}
                {/* Cinematic Overlays */}
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

            {/* Background Large Text — decorative tint only, never a competitor
                to the headline sitting on top of it. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
            >
                Stay
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
                <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    {`// staying at: ${priceRange}`}
                </span>

                <h1 className="mb-10 text-balance text-[clamp(2.25rem,6.5vw,5rem)] font-light uppercase leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
                    {name.split(' ').map((word, i) => (
                        <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                            {word}{' '}
                        </span>
                    ))}
                </h1>

                {/* Hairline gaps over a tinted wrapper, rather than free-standing
                    vertical rules: dividers drawn as siblings dangle in the wrong
                    place the moment the row wraps. */}
                <div className="flex w-full flex-wrap gap-px rounded-xs border border-white/10 bg-white/10 backdrop-blur-2xl">
                    <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/40 p-6 text-left md:p-8">
                        <div className="w-14 h-14 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/60">
                            <MapPin className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="text-left">
                            <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Location</span>
                            <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">
                                {location || "Kingdom of Bhutan"}
                            </span>
                        </div>
                    </div>

                    <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/40 p-6 text-left md:p-8">
                        <div className="w-14 h-14 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/60">
                            <Star className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="text-left">
                            <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Class</span>
                            <span className="flex gap-1 py-1.5" aria-label={`${rating} out of 5 stars`}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-white/25"}`}
                                    />
                                ))}
                            </span>
                            <span className="block font-mono text-[12px] text-gray-300 tracking-normal mt-1 normal-case">
                                {priceRange} standard
                            </span>
                        </div>
                    </div>

                    {(nightlyRate || rooms) && (
                        <div className="group flex min-w-[260px] flex-1 items-center gap-5 bg-black/40 p-6 text-left md:p-8">
                            <div className="w-14 h-14 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/60">
                                <BedDouble className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="text-left">
                                <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">
                                    {nightlyRate ? "Rate From" : "Capacity"}
                                </span>
                                <span className="font-light tracking-widest text-lg md:text-xl uppercase text-white">
                                    {nightlyRate ?? `${rooms} Suites`}
                                </span>
                                <span className="block font-mono text-[12px] text-gray-300 tracking-normal mt-1 normal-case">
                                    {nightlyRate ? "per night" : "available"}
                                    {nightlyRate && rooms ? ` · ${rooms} suites` : ""}
                                </span>
                            </div>
                        </div>
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
                        Verified stay
                    </p>
                </div>
                <div className="w-px h-16 bg-linear-to-b from-amber-500/50 to-transparent" />
            </div>
        </div>
    );
}
