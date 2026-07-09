"use client";

import { motion } from "framer-motion";

interface ExperienceOverviewProps {
    title: string;
    description: string;
    highlights?: string[];
}

export function ExperienceOverview({
    title,
    description,
    highlights,
}: ExperienceOverviewProps) {
    return (
        <div className="flex flex-col gap-12">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <span className="font-mono text-amber-500 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
                    // experience overview
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase">
                    The <span className="italic font-serif normal-case text-amber-600">Essence</span> <br />of {title}
                </h2>
                <div className="relative pl-8 border-l border-black/10">
                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light italic">
                        "{description}"
                    </p>
                    <div className="mt-8 font-mono text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                        verified information // Kingdom of Bhutan
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
