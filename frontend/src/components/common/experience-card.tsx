"use client";

import { FadeImage } from "@/components/common/fade-image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatDuration } from "@/lib/utils";

export interface Experience {
    slug?: string;
    title: string;
    category?: string;
    description: string;
    image: string;
    duration?: string;
    destinationSlug?: string;
}

export interface ExperienceCardProps {
    experience: Experience;
    index: number;
    disableLink?: boolean;
    className?: string;
}

export function ExperienceCard({ experience, index, disableLink, className }: ExperienceCardProps) {
    const CardContent = (
        <div className={cn(
            "group relative block aspect-4/5 overflow-hidden rounded-xs border border-black/5 bg-neutral-100 pointer-events-auto cursor-pointer",
            className
        )}>
            {/* Image Layer */}
            {experience.image && (
                <FadeImage
                    src={experience.image}
                    alt={experience.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 object-cover duration-1000 saturate-[0.8] group-hover:scale-110"
                />
            )}

            {/* Cinematic Overlay - Dark gradient for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-20" />

            {/* Card UI */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30 text-white">
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] tracking-widest uppercase bg-white/10 backdrop-blur-md px-3 py-1 border border-white/10">
                        ID: {index.toString().padStart(2, '0')}
                    </span>
                    {experience.duration && (
                        <span className="font-mono text-[9px] tracking-widest uppercase bg-amber-500/20 backdrop-blur-md px-3 py-1 border border-amber-500/20 text-amber-500">
                            {formatDuration(experience.duration)}
                        </span>
                    )}
                </div>

                <div>
                    {experience.destinationSlug && (
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2 block">
                            {experience.destinationSlug}
                        </span>
                    )}
                    {experience.category && (
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-500 mb-4 block">
                            {experience.category}
                        </span>
                    )}
                    <h4 className="text-3xl md:text-4xl font-light tracking-tighter mb-6 group-hover:italic transition-all duration-500 line-clamp-2 uppercase">
                        {experience.title}
                    </h4>
                    <p className="text-base text-white/60 font-light leading-relaxed line-clamp-2 italic mb-6">
                        &quot;{experience.description}&quot;
                    </p>
                    <div className="flex items-center gap-4 text-white/50 group-hover:text-white transition-colors duration-500">
                        <span className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-amber-500 transition-all duration-500" />
                        <span className="font-mono text-[9px] uppercase tracking-widest">
                            View experience
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Reveal y={0} scale={0.98} delay={index * 0.1} duration={0.6}>
            {experience.slug && !disableLink ? (
                <Link href={`/experiences/${experience.slug}`}>
                    {CardContent}
                </Link>
            ) : (
                CardContent
            )}
        </Reveal>
    );
}
