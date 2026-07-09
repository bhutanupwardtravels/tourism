"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface FestivalCardProps {
    festival: {
        slug: string;
        title: string;
        description: string;
        image: string;
    };
    index: number;
}

export function FestivalCard({ festival, index }: FestivalCardProps) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={isEven ? "lg:col-span-7" : "lg:col-span-5 lg:mt-24"}
        >
            <Link
                href={`/experiences/${festival.slug}`}
                className="group block relative overflow-hidden bg-neutral-100 border border-black/5 p-8 md:p-12 hover:border-amber-600/30 transition-all duration-700"
            >
                <div className="flex flex-col gap-10">
                    <div className="relative aspect-video overflow-hidden rounded-xs">
                        <img
                            src={festival.image}
                            alt={festival.title}
                            className="w-full h-full object-cover transition-all duration-1000 saturate-[1.2] group-hover:saturate-[1.5] group-hover:scale-110"
                        />
                        {/* No desaturating overlay to keep colors vibrant as requested */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />

                        <div className="absolute top-6 left-6">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 font-mono text-[8px] tracking-[0.3em] border border-black/10 uppercase text-black">
                                Experience: {index + 10}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-600">
                                Annual Cultural Event
                            </span>
                        </div>

                        <h3 className="text-4xl md:text-5xl font-light tracking-tighter group-hover:italic group-hover:text-black transition-all duration-500 uppercase">
                            {festival.title}
                        </h3>

                        <div className="pl-6 border-l border-black/10">
                            <p className="text-gray-500 text-sm leading-relaxed font-light italic line-clamp-2">
                                "{festival.description}"
                            </p>
                        </div>

                        <div className="pt-6 flex justify-between items-center border-t border-black/5">
                            <div className="flex items-center gap-4 text-gray-400 group-hover:text-black transition-colors">
                                <span className="h-px w-8 bg-black/20 group-hover:w-16 group-hover:bg-amber-600/50 transition-all duration-500" />
                                <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 group-hover:text-black">View Details</span>
                            </div>
                            <Calendar className="w-4 h-4 text-black/20 group-hover:text-amber-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
