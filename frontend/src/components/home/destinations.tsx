"use client";

import { motion } from "framer-motion";
import { Destination } from "@/app/(website)/destinations/schema";
import { DestinationCard } from "@/components/common/destination-card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import * as React from "react";
import { Reveal } from "@/components/ui/reveal";

interface DestinationsProps {
    destinations: Destination[];
}

export function Destinations({ destinations }: DestinationsProps) {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollPrev();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    // Guard against empty destinations
    if (!destinations || destinations.length === 0) {
        return null;
    }

    return (
        <section className="py-24 md:py-40 bg-white relative overflow-hidden">
            {/* Decorative Background Text - Seamless Loop */}
            <div aria-hidden className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
                <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex whitespace-nowrap"
                >
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        Regions
                    </span>
                    <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
                        Regions
                    </span>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 pb-12">
                    <div>
                        <Reveal as="span" y={0} x={-20}
                            className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block">
                            {"// explore by region"}
                        </Reveal>
                        <Reveal as="h2" y={20} delay={0.1}
                            className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black">
                            Featured <span className="italic font-serif normal-case text-amber-600">Destinations</span>
                        </Reveal>
                    </div>
                    <Reveal y={0} x={20} delay={0.3}>
                        <Link
                            href="/destinations"
                            className="group flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-gray-500 hover:text-black transition-colors"
                        >
                            <span className="h-px w-12 bg-black/20 group-hover:w-20 group-hover:bg-amber-600 transition-all duration-500" />
                            See all destinations
                        </Link>
                    </Reveal>
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
                        {destinations.map((destination, index) => (
                            <CarouselItem
                                key={destination.slug}
                                className="pl-8 md:basis-1/2 lg:basis-1/2"
                            >
                                <Reveal y={30} duration={0.8}>
                                    <DestinationCard destination={destination} index={index} />
                                </Reveal>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons below the carousel */}
                    <div className="flex justify-end gap-4 mt-16">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                        <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
