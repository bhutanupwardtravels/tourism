"use client";

import { FadeImage } from "@/components/common/fade-image";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Destination } from "@/app/(website)/destinations/schema";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
    destination: Destination;
    /** Kept for call-site parity with the other cards; no longer rendered. */
    index?: number;
    className?: string;
    onClick?: () => void;
    disableLink?: boolean;
}

export function DestinationCard({ destination, className, onClick, disableLink }: DestinationCardProps) {
    const CardContent = (
        <>
            {/* Image Container */}
            <div className="relative aspect-16/10 overflow-hidden rounded-xs bg-neutral-100 border border-black/5 mb-8">
                {destination.image && (
                    <FadeImage
                        src={destination.image}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover duration-1000 group-hover:scale-110"
                    />
                )}
                {/* Status Overlay */}
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <span className="h-px w-8 bg-amber-600/50" />
                    <span className="font-mono text-xs text-amber-600 uppercase tracking-widest font-bold">View destination</span>
                </div>
            </div>

            {/* Metadata */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold">
                        {destination.region}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-light tracking-tighter text-black group-hover:italic transition-all duration-500 line-clamp-2 uppercase">
                        {destination.name}
                    </h3>
                </div>
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:border-amber-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-black transition-transform group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
            </div>

            <p className="mt-6 text-gray-500 font-light leading-relaxed line-clamp-2 italic text-base">
                &quot;{destination.description}&quot;
            </p>
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
