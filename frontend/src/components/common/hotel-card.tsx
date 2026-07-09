"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Hotel } from "@/app/admin/hotels/schema";

interface HotelCardProps {
    hotel: Hotel;
    index: number;
    className?: string;
    disableLink?: boolean;
    onClick?: () => void;
}

export function HotelCard({ hotel, index, className, disableLink, onClick }: HotelCardProps) {
    // Handle rating logic (can be string or number)
    const ratingValue = typeof hotel.rating === 'string' ? parseFloat(hotel.rating) : hotel.rating || 5;
    const starsArray = [...Array(Math.floor(ratingValue))].slice(0, 5);

    const CardContent = (
        <div className={cn(
            "group relative block aspect-4/5 overflow-hidden rounded-xs border border-black/5 bg-neutral-100 pointer-events-auto cursor-pointer",
            className
        )}>
            {/* Image Layer */}
            <img
                src={hotel.image}
                alt={hotel.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Cinematic Overlay - Dark gradient for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-20" />

            {/* Card UI */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30">
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] tracking-widest uppercase bg-white/10 backdrop-blur-md px-3 py-1 border border-white/10 text-white">
                        REF: {hotel.priceRange}
                    </span>
                    <div className="flex gap-1 group-hover:gap-2 transition-all duration-500">
                        {starsArray.map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        ))}
                    </div>
                </div>

                <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-500 mb-4 block">
                        Hospitality
                    </span>
                    <h4 className="text-3xl font-light tracking-tighter text-white mb-6 group-hover:italic transition-all duration-500 line-clamp-2 uppercase">
                        {hotel.name}
                    </h4>
                    <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-2 italic mb-6">
                        "{hotel.description}"
                    </p>
                    <div className="flex items-center gap-4 text-white/50 group-hover:text-white transition-colors duration-500">
                        <span className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-amber-500 transition-all duration-500" />
                        <span className="font-mono text-[9px] uppercase tracking-widest">View Accommodation</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            {disableLink || onClick ? (
                <div onClick={onClick}>
                    {CardContent}
                </div>
            ) : (
                <Link href={`/hotels/${hotel.slug}`}>
                    {CardContent}
                </Link>
            )}
        </motion.div>
    );
}
