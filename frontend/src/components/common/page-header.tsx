"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
    label: string;
    title: string;
    description: string;
    bgText?: string;
}

export function PageHeader({ label, title, description, bgText }: PageHeaderProps) {
    // Extract accent text if it's in a specific format or just split the title
    // For simplicity and flexibility, I'll support a title string and let the user handle spans if needed,
    // but the user's design usually has "Word <span class='italic font-serif text-amber-600'>Word</span>"
    // I will use regex to find words in brackets or similar, or just allow title to be ReactNode.

    return (
        <div className="pt-48 pb-12 relative overflow-hidden">
            {/* Large Background Decorative Text */}
            {bgText && (
                <motion.div
                    animate={{ x: ['-5%', '5%'] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none transform translate-y-24"
                >
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block whitespace-nowrap">
                        {bgText}
                    </span>
                </motion.div>
            )}

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block"
                    >
                        {label}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-[8rem] lg:text-[10rem] font-light tracking-tighter leading-none mb-10 uppercase"
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
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-500 text-lg font-light max-w-xl leading-relaxed italic border-l border-black/10 pl-8"
                    >
                        "{description}"
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
