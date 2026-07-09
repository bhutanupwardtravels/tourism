"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExperienceType } from "@/app/admin/experience-types/schema";

export function ExperienceTypes({ experienceTypes }: { experienceTypes: ExperienceType[] }) {
    // We can still limit it to 3 if we want the same look
    const showcaseExperiences = experienceTypes.slice(0, 3);

    return (
        <section className="py-24 md:py-40 bg-white border-t border-black/5 relative overflow-hidden">
            {/* Background Decorative ID */}
            <div className="absolute top-0 right-12 font-mono text-[15vw] opacity-[0.03] select-none pointer-events-none font-bold uppercase tracking-tighter">
                Intel
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block">
                // curate your experience
                        </span>
                        <h2 className="text-5xl md:text-7xl font-light text-black tracking-tighter leading-tight uppercase">
                            Why <span className="italic font-serif normal-case text-amber-600">Bhutan?</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="pb-4"
                    >
                        <Link
                            href="/experiences"
                            className="group inline-flex items-center gap-2 text-[10px] font-mono font-medium tracking-[0.3em] uppercase hover:text-amber-600 transition-all text-gray-400 border-b border-transparent hover:border-amber-600 pb-1"
                        >
                            All Field Briefings
                        </Link>
                    </motion.div>
                </div>

                <div className="space-y-20">
                    {experienceTypes.map((experience, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className="w-full md:w-1/2"
                            >
                                <Link href={`/experiences?category=${encodeURIComponent(experience.title)}`} className="block group relative bg-neutral-100 border border-black/10 hover:border-amber-600/50 transition-all duration-700 rounded-xs overflow-hidden">
                                    {/* Image Container with Reveal */}
                                    <div className="aspect-4/3 overflow-hidden relative">
                                        <img
                                            src={experience.image}
                                            alt={experience.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                                            <span className="bg-white/80 backdrop-blur-md px-3 py-1 font-mono text-[9px] tracking-widest border border-black/10 text-black">
                                                TYPE-{index.toString().padStart(2, '0')}
                                            </span>
                                            <div className="w-12 h-12 rounded-full border border-black/10 hidden group-hover:flex items-center justify-center group-hover:border-amber-500 transition-colors">
                                                <ArrowUpRight className="w-5 h-5 text-black transition-transform group-hover:translate-x-1 group-hover:text-amber-500 group-hover:-translate-y-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="w-full md:w-1/2">
                                <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.3em] mb-4 block">
                            // Experience Type
                                </span>
                                <h3 className="text-4xl md:text-5xl font-light mb-6 text-black tracking-tight leading-tight">
                                    {experience.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed mb-8 max-w-lg font-light">
                                    {experience.description}
                                </p>
                                <Link
                                    href={`/experiences?category=${encodeURIComponent(experience.title)}`}
                                    className="group inline-flex items-center gap-4 text-gray-500 hover:text-black transition-colors"
                                >
                                    <span className="h-px w-12 bg-black/20 group-hover:w-20 group-hover:bg-amber-600 transition-all duration-500" />
                                    <span className="font-mono text-[10px] uppercase tracking-widest">Initialise Mission</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
