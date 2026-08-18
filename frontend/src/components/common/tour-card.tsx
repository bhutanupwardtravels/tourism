"use client";

import { FadeImage } from "@/components/common/fade-image";

import Link from "next/link";
import { ArrowUpRight, Calendar, DollarSign, Check } from "lucide-react";
import { Tour } from "@/app/(website)/tours/schema";

import { Reveal } from "@/components/ui/reveal";
import { TierBadge } from "@/components/common/tier-badge";
interface TourCardProps {
    tour: Tour;
    index: number;
    onClick?: () => void;
    isSelected?: boolean;
}

export function TourCard({ tour, index, onClick, isSelected }: TourCardProps) {
    const categoryTitle = tour.category || "Expedition";
    const pricing = tour.pricing;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const CardContent = (
        <>
            {/* Image Container */}
            <div className={`relative aspect-16/10 overflow-hidden rounded-xs bg-neutral-100 border transition-colors duration-500 mb-8 ${isSelected ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-black/5'}`}>
                {tour.image && (
                    <FadeImage
                        src={tour.image}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover duration-1000 saturate-[1.2] brightness-[1.1] group-hover:scale-110"
                    />
                )}

                <span className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-amber-700 px-3 py-1 text-[11px] uppercase tracking-[0.12em] font-bold z-20 shadow-lg">
                    {categoryTitle}
                </span>

                {tour.featured && (
                    <span className="absolute top-6 left-6 bg-amber-600 text-white px-3 py-1 text-[11px] uppercase tracking-[0.12em] font-bold z-20 shadow-lg">
                        Featured
                    </span>
                )}

                {isSelected && (
                    <div className="absolute inset-0 bg-amber-600/10 z-10 flex items-center justify-center backdrop-blur-sm transition-all">
                        <div className="bg-white text-amber-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest shadow-xl">
                            Selected
                        </div>
                    </div>
                )}
            </div>

            {/* Metadata */}
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-6 mb-3 text-[13px] text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-amber-600/60" />
                            {tour.duration}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-600/10 rounded-xs text-black border border-amber-600/20 shadow-xs whitespace-nowrap">
                            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-gray-500 font-normal">From</span>
                            {formatPrice(tour.price)}
                            <span className="text-gray-500 font-normal">/person</span>
                        </div>
                    </div>

                    {/* Length x comfort tier = price. Spelling out the per-day rate lets
                        the eye compare a 4-day break with a 15-day expedition directly. */}
                    <div className="flex items-center justify-between gap-4 mb-4 min-h-[26px]">
                        <TierBadge tier={pricing?.tier} signatureStay={pricing?.signatureStay} />
                        <span className="text-[11px] text-gray-500 whitespace-nowrap">
                            {pricing?.perDay ? `${formatPrice(pricing.perDay)} / day · ` : ""}SDF incl.
                        </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-light tracking-tighter text-black group-hover:italic transition-all duration-500 line-clamp-2 uppercase">
                        {tour.title}
                    </h3>
                </div>

                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ml-6 shrink-0 ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-black/10 group-hover:border-amber-500'}`}>
                    {isSelected ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <ArrowUpRight className="w-5 h-5 text-black transition-transform group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    )}
                </div>
            </div>

            <p className="mt-6 text-gray-500 font-light leading-relaxed line-clamp-2 italic text-md">
                "{tour.description}"
            </p>
        </>
    );

    if (onClick) {
        return (
            <Reveal y={30} delay={index * 0.1} duration={0.8}>
                <button onClick={onClick} className="group relative block w-full text-left">
                    {CardContent}
                </button>
            </Reveal>
        );
    }

    return (
        <Reveal y={30} delay={index * 0.1} duration={0.8}>
            <Link
                href={`/tours/${tour.slug}`}
                className="group relative block"
            >
                {CardContent}
            </Link>
        </Reveal>
    );
}
