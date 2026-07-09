"use client";

import { motion } from "framer-motion";
import { Tour } from "../../schema";
import { TourCard } from "@/components/common/tour-card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";

interface TourCarouselProps {
    tours: Tour[];
    currentSlug: string;
}

export function TourCarousel({
    tours,
    currentSlug,
}: TourCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    // Filter out current tour, sort by priority (descending), and take top 6
    const otherTours = tours
        .filter((t) => t.slug !== currentSlug)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 6);

    if (otherTours.length === 0) return null;

    return (
        <section className="py-40 bg-white text-black relative overflow-hidden">
            {/* Decorative Background Text - Seamless Loop (Right to Left) */}
            <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex whitespace-nowrap"
                >
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        Discovery
                    </span>
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        Discovery
                    </span>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block"
                        >
                            // expeditions: next assignments
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black"
                        >
                            Other <span className="italic font-serif normal-case text-amber-600">Expeditions</span>
                        </motion.h2>
                    </div>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="-ml-8">
                        {otherTours.map((tour, index) => (
                            <CarouselItem
                                key={tour.slug}
                                className="pl-8 md:basis-1/2"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <TourCard
                                        tour={tour}
                                        index={index}
                                    />
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-start gap-4 mt-16">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                        <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
