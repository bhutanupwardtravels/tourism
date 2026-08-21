"use client";

import { Reveal } from "@/components/ui/reveal";
interface ExperienceOverviewProps {
    description: string;
    highlights?: string[];
}

export function ExperienceOverview({
    description,
}: ExperienceOverviewProps) {
    return (
        <div className="flex flex-col gap-12">
            <Reveal y={0} x={-30} duration={1}>
                <span className="font-mono text-amber-500 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
                    {"// experience overview"}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                    About this <span className="italic font-serif normal-case text-amber-600">experience</span>
                </h2>
                <div className="relative pl-8 border-l border-black/10">
                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                        &quot;{description}&quot;
                    </p>
                    <div className="mt-8 font-mono text-xs text-gray-400 uppercase tracking-widest">
                        verified information // Kingdom of Bhutan
                    </div>
                </div>
            </Reveal>

        </div>
    );
}
