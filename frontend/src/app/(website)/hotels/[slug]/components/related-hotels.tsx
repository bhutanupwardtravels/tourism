"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hotel } from "@/app/(website)/hotels/schema";
import { HotelCard } from "@/components/common/hotel-card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";

interface RelatedHotelsProps {
    hotels: Hotel[];
}

export function RelatedHotels({ hotels }: RelatedHotelsProps) {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollPrev();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    if (!hotels || hotels.length === 0) return null;

    // Ensure we only show top 6 and they are sorted by priority (though already handled in action)
    const displayedHotels = [...hotels]
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 6);

    return (
        <section className="py-32 bg-neutral-50 border-t border-black/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-4xl">
                        <span className="font-mono text-amber-600 text-[13px] uppercase tracking-[0.4em] mb-6 block font-bold">
                            // refined selection
                        </span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-tight mb-8 md:mb-12 uppercase text-black">
                            Other <span className="italic font-serif normal-case text-amber-600">Extraordinary</span> Stays
                        </h2>
                    </div>
                    <Link
                        href="/hotels"
                        className="font-mono text-[10px] tracking-[0.4em] uppercase text-black hover:text-amber-600 transition-colors border-b border-black pb-1 mb-12 font-bold"
                    >
                        View all accommodations
                    </Link>
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
                        {displayedHotels.map((hotel, index) => (
                            <CarouselItem
                                key={hotel.id}
                                className="pl-8 md:basis-1/2 lg:basis-1/3"
                            >
                                <HotelCard hotel={hotel} index={index} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons below the carousel */}
                    <div className="flex justify-center gap-4 mt-16">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                        <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
