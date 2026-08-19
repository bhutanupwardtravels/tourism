"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    label: string;
    title: string;
    description: string;
    bgText?: string;
    /**
     * Index pages are reached by people who have already declared their intent
     * — someone on /tours wants to see tours. A full screen of decorative
     * typography is friction applied to an already-converted visitor, so those
     * pages run a shorter header that leaves the first cards on screen. Editorial
     * pages (terms, travel guide) keep the full-height version.
     */
    compact?: boolean;
}

export function PageHeader({ label, title, description, bgText, compact }: PageHeaderProps) {
    // Extract accent text if it's in a specific format or just split the title
    // For simplicity and flexibility, I'll support a title string and let the user handle spans if needed,
    // but the user's design usually has "Word <span class='italic font-serif text-amber-600'>Word</span>"
    // I will use regex to find words in brackets or similar, or just allow title to be ReactNode.

    return (
        <div className={cn("relative overflow-hidden", compact ? "pt-28 pb-6" : "pt-32 pb-8")}>
            {/* Large Background Decorative Text */}
            {bgText && (
                <motion.div
                    aria-hidden
                    animate={{ x: ['-5%', '5%'] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none transform translate-y-24"
                >
                    <span className="text-[14vw] font-bold uppercase leading-none tracking-tighter block whitespace-nowrap">
                        {bgText}
                    </span>
                </motion.div>
            )}

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block">
                        {label}
                    </span>
                    <h1
                        className={cn(
                            "font-light tracking-tighter leading-none uppercase",
                            compact
                                ? "text-5xl md:text-6xl lg:text-7xl mb-5"
                                : "text-7xl md:text-[8rem] lg:text-[10rem] mb-10"
                        )}
                    >
                        {title.split(' ').map((word, i, arr) => {
                            const isLast = i === arr.length - 1;
                            return (
                                <span key={i}>
                                    {isLast ? (
                                        <span className="italic font-serif normal-case text-amber-600">
                                            {word}
                                        </span>
                                    ) : (
                                        <>{word} </>
                                    )}
                                </span>
                            );
                        })}
                    </h1>
                    <p
                        className={cn(
                            "text-gray-500 font-light max-w-xl leading-relaxed italic border-l border-black/10",
                            compact ? "text-base pl-6" : "text-lg pl-8"
                        )}
                    >
                        &quot;{description}&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}
