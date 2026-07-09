"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Destination } from "@/app/(website)/destinations/schema";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
    destination: Destination;
    index: number;
    className?: string;
    onClick?: () => void;
    disableLink?: boolean;
}

export function DestinationCard({ destination, index, className, onClick, disableLink }: DestinationCardProps) {
    const CardContent = (
        <>
            {/* Image Container */}
            <div className="relative aspect-16/10 overflow-hidden rounded-xs bg-neutral-100 border border-black/5 mb-8">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Status Overlay */}
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <span className="h-px w-8 bg-amber-600/50" />
                    <span className="font-mono text-[9px] text-amber-600 uppercase tracking-widest font-bold">Explore Now</span>
                </div>
            </div>

            {/* Metadata */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">
                        Region: {destination.region}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter group-hover:italic transition-all duration-500 text-black">
                        {destination.name}
                    </h2>
                </div>
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:border-amber-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-black transition-transform group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
            </div>

            <p className="mt-6 text-gray-600 font-light leading-relaxed max-w-md line-clamp-2 italic text-lg">
                "{destination.description}"
            </p>

            {/* Vertical Decorative ID */}
            <div className="absolute top-0 -right-4 font-mono text-[8px] tracking-widest text-gray-300 rotate-90 origin-top-left py-2 border-l border-black/5">
                DEST-0{index + 1} // BHUTAN
            </div>
        </>
    );

    if (onClick || disableLink) {
        return (
            <div
                onClick={onClick}
                className={cn("group block relative cursor-pointer", className)}
            >
                {CardContent}
            </div>
        );
    }

    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className={cn("group block relative", className)}
        >
            {CardContent}
        </Link>
    );
}
