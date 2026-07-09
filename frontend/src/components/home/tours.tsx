"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plane, Users, Activity, Clock } from "lucide-react";
import { Tour } from "@/app/(website)/tours/schema";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";

interface FeaturedItineraryProps {
    itineraries: Tour[];
}

export function FeaturedItinerary({ itineraries }: FeaturedItineraryProps) {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollPrev();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    if (!itineraries || itineraries.length === 0) return null;

    return (
        <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden bg-black text-white border-b border-white/5">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                setApi={setApi}
                className="h-full w-full"
            >
                <CarouselContent className="h-[85vh] min-h-[700px] ml-0">
                    {itineraries.map((itinerary, index) => (
                        <CarouselItem key={itinerary.slug} className="h-full w-full pl-0 relative">
                            {/* Background Image with Minimal Overlays */}
                            <div className="absolute inset-0 z-0">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 1.5 }}
                                    src={itinerary.image}
                                    alt={itinerary.title}
                                    className="w-full h-full object-cover brightness-75"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10" />
                                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-10" />
                            </div>

                            {/* Content */}
                            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
                                <div className="max-w-4xl">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <span className="font-mono text-amber-500 text-xs uppercase tracking-[0.6em] mb-6 block">
                      // {itinerary.duration} Day Expedition // 0{index + 1}
                                        </span>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase"
                                    >
                                        {itinerary.title.split(' ').map((word, i) => (
                                            <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500 block md:inline" : ""}>
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12 font-light max-w-2xl italic"
                                    >
                                        "{itinerary.description}"
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="flex items-center gap-12"
                                    >
                                        <Link
                                            href={`/tours/${itinerary.slug}`}
                                            className="group flex items-center gap-6 bg-white text-black px-12 py-5 text-[10px] font-mono text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-2xl relative overflow-hidden"
                                        >
                                            <span className="relative z-10 text-xs">Explore Itinerary</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform relative z-10" />
                                        </Link>

                                        <div className="hidden lg:flex items-center gap-4">
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map((s) => (
                                                    <div key={s} className="w-8 h-px bg-amber-500/50" />
                                                ))}
                                            </div>
                                            <span className="font-mono text-[8px] text-amber-500/50 uppercase tracking-widest">Active Sequence</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Carousel Navigation - Simplified */}
                <div className="absolute bottom-12 right-6 md:right-12 z-30 flex items-center gap-4">
                    <CarouselPrevious className="static translate-y-0 h-16 w-16 bg-white/10 backdrop-blur-md hover:bg-amber-500 hover:text-white border-white/10 transition-all duration-500" />
                    <CarouselNext className="static translate-y-0 h-16 w-16 bg-white/10 backdrop-blur-md hover:bg-amber-500 hover:text-white border-white/10 transition-all duration-500" />
                </div>
            </Carousel>
        </section>
    );
}

