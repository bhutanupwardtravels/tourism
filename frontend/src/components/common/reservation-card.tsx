"use client";

import { Reveal } from "@/components/ui/reveal";
interface ReservationCardProps {
    slug: string;
    className?: string;
}

export function ReservationCard({ className = "" }: ReservationCardProps) {
    return (
        <Reveal y={0} scale={0.95} delay={0.2} duration={0.8}
            className={`sticky top-32 ${className}`}>
            <div className="relative p-10 border border-black/5 bg-white shadow-xs overflow-hidden group">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-600/20 group-hover:border-amber-600/50 transition-colors" />

                <span className="font-mono text-[8px] md:text-[10px] text-amber-600 uppercase tracking-[0.4em] md:tracking-[0.5em] mb-6 md:mb-8 block font-bold">
                    // plan this trip
                </span>

                <h3 className="text-3xl lg:text-4xl font-light tracking-tighter text-black mb-8 uppercase italic serif">
                    Plan Your <span className="font-serif normal-case">Adventure</span>
                </h3>

                <p className="text-gray-600 font-light leading-relaxed mb-12 text-sm">
                    Tell us your dates and group size and a specialist will build this into
                    a full itinerary. You&apos;ll get a detailed quote within 24 hours.
                </p>

                <div className="space-y-6">
                    <a
                        href="/plan-my-trip"
                        className="group relative flex items-center justify-center gap-6 bg-black py-5 text-white text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-amber-600 overflow-hidden"
                    >
                        <span className="relative z-10">Plan my trip</span>
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-amber-500 transition-transform duration-500" />
                    </a>
                </div>
            </div>
        </Reveal>
    );
}
