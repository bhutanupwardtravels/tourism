"use client";

import { Reveal } from "@/components/ui/reveal";

const DEFAULT_DESCRIPTION =
    "Tell us your dates and group size and a specialist will build this into a full itinerary. You'll get a detailed quote within 24 hours.";

interface ReservationCardProps {
    /** Kept for callers that identify the page they sit on; navigation uses `href`. */
    slug?: string;
    className?: string;
    /** Mono eyebrow above the heading. */
    label?: string;
    /** Heading, split so the second half takes the serif accent. */
    title?: string;
    titleAccent?: string;
    /** Body copy — worth tailoring per surface (a tour already has an itinerary). */
    description?: string;
    /**
     * Where the CTA goes. Tours pass `?package=<slug>` so the planner lands on
     * that package; destination and experience slugs are not packages, so they
     * keep the bare planner.
     */
    href?: string;
    ctaLabel?: string;
}

export function ReservationCard({
    className = "",
    label = "// plan this trip",
    title = "Plan Your",
    titleAccent = "Adventure",
    description = DEFAULT_DESCRIPTION,
    href = "/plan-my-trip",
    ctaLabel = "Plan my trip",
}: ReservationCardProps) {
    return (
        <Reveal y={0} scale={0.95} delay={0.2} duration={0.8}
            className={`sticky top-32 ${className}`}>
            <div className="relative p-10 border border-black/5 bg-white shadow-xs overflow-hidden group">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-600/20 group-hover:border-amber-600/50 transition-colors" />

                <span className="font-mono text-xs text-amber-600 uppercase tracking-[0.4em] md:tracking-[0.5em] mb-6 md:mb-8 block font-bold">
                    {label}
                </span>

                <h3 className="text-3xl lg:text-4xl font-light tracking-tighter text-black mb-8 uppercase italic serif">
                    {title} <span className="font-serif normal-case">{titleAccent}</span>
                </h3>

                <p className="text-gray-600 font-light leading-relaxed mb-12 text-sm">
                    {description}
                </p>

                <div className="space-y-6">
                    <a
                        href={href}
                        className="group relative flex items-center justify-center gap-6 bg-black py-5 text-white text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-amber-600 overflow-hidden"
                    >
                        <span className="relative z-10">{ctaLabel}</span>
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-amber-500 transition-transform duration-500" />
                    </a>
                </div>
            </div>
        </Reveal>
    );
}
