"use client";

import Image from "next/image";

import { Star, MapPin } from "lucide-react";

interface HotelHeroProps {
    name: string;
    image: string;
    location?: string;
    rating: number;
    priceRange: string;
}

export function HotelHero({ name, image, location, rating, priceRange }: HotelHeroProps) {
    return (
        <div className="h-[72vh] min-h-[520px] relative overflow-hidden bg-white">
            {/* Background Image */}
            <div className="absolute inset-0">
                {image && (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                <div className="max-w-4xl">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="font-mono text-[10px] tracking-[0.4em] uppercase bg-white/20 backdrop-blur-md px-4 py-1.5 border border-white/20">
                            {priceRange} Luxury
                        </span>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-white/30"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-[8rem] font-light tracking-tighter leading-none mb-8 uppercase drop-shadow-2xl">
                        {name.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>

                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-12 bg-white/30" />
                        <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase opacity-80">
                            <MapPin className="w-3 h-3 text-amber-500" />
                            {location || "Kingdom of Bhutan"}
                        </div>
                        <div className="h-px w-12 bg-white/30" />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black opacity-40">Discovery</span>
                <div className="w-px h-12 bg-linear-to-b from-black/40 to-transparent" />
            </div>
        </div>
    );
}
