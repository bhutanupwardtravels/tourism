"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JsonLd } from "@/components/common/json-ld";
import { faqPageJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

interface FaqSectionItem {
    question: string;
    answer: string;
}

interface FaqSectionProps {
    label: string;
    title: string;
    bgText: string;
    items: FaqSectionItem[];
    className?: string;
}

export function FaqSection({ label, title, bgText, items, className }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (items.length === 0) return null;

    const words = title.split(" ");
    const lastWord = words.pop();
    const leadWords = words.join(" ");

    return (
        <section className={cn("py-24 md:py-40 bg-white relative overflow-hidden", className)}>
            <JsonLd data={faqPageJsonLd(items)} />

            {/* Decorative Background Text - Seamless Loop */}
            <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap"
                >
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        {bgText}
                    </span>
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        {bgText}
                    </span>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-24 max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block"
                    >
                        {label}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black"
                    >
                        {leadWords ? `${leadWords} ` : ""}
                        <span className="italic font-serif normal-case text-amber-600">{lastWord}</span>
                    </motion.h2>
                </div>

                <div className="max-w-3xl divide-y divide-black/10 border-t border-b border-black/10">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={item.question}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.6 }}
                                className="py-6"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-6 text-left text-lg md:text-xl font-medium text-black transition-colors hover:text-amber-600"
                                >
                                    <span>{item.question}</span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="shrink-0 text-2xl leading-none font-light"
                                    >
                                        +
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pt-4 text-base leading-relaxed text-black/70">
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
