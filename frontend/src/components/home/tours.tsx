"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Tour } from "@/app/(website)/tours/schema";
import { TourCard } from "@/components/common/tour-card";
import { Reveal } from "@/components/ui/reveal";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedItineraryProps {
    itineraries: Tour[];
}

/**
 * The first thing under the hero. People arrive asking "is there a trip for me,
 * and what does it cost" — so this answers both before any philosophy: real
 * itineraries, real prices, real durations, above the fold on the first scroll.
 *
 * Two per row rather than three: a tour card carries a duration, a price, a
 * per-day rate, a tier badge and a title, and at a third of the container that
 * stack is dense enough that the titles truncate mid-word. The carousel keeps
 * the same number of trips reachable without cramming them into one row.
 */
export function FeaturedItinerary({ itineraries }: FeaturedItineraryProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [isPaused, setIsPaused] = React.useState(false);

    // Advances on its own like the destinations carousel, but holds still while
    // the pointer or keyboard focus is inside it — these cards carry prices
    // people are actively comparing, and moving them mid-read is hostile.
    //
    // The document.hidden guard is load-bearing: a background tab still fires
    // the interval but has layout suspended, so embla advances against
    // zero-width measurements and the loop offset walks off the end of the
    // track. Come back to the tab and the row is blank.
    React.useEffect(() => {
        if (!api || isPaused) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduceMotion.matches) return;

        const interval = setInterval(() => {
            if (document.hidden) return;
            api.scrollNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [api, isPaused]);

    if (!itineraries || itineraries.length === 0) return null;

    return (
        <section className="bg-white border-b border-black/5 py-20 md:py-28">
            <div className="container mx-auto px-6">
                <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <Reveal y={20} duration={0.8} className="max-w-2xl">
                        <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block">
                            {"// featured journeys"}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-light text-black tracking-tighter leading-tight uppercase">
                            Trips You Can <span className="italic font-serif normal-case text-amber-600">Book</span>
                        </h2>
                        <p className="mt-4 text-gray-500 font-light leading-relaxed">
                            Fully guided itineraries with everything priced up front — hotels, guide,
                            transport and the Sustainable Development Fee included.
                        </p>
                    </Reveal>

                    <Reveal y={0} x={20} delay={0.2} duration={0.8} className="pb-2">
                        <Link
                            href="/tours"
                            className="group inline-flex items-center gap-3 border border-black/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition-colors hover:border-amber-600 hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                            See all tours
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Reveal>
                </div>

                <Carousel
                    opts={{ align: "start", loop: true }}
                    setApi={setApi}
                    className="w-full"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocusCapture={() => setIsPaused(true)}
                    onBlurCapture={() => setIsPaused(false)}
                >
                    <CarouselContent className="-ml-8">
                        {itineraries.map((tour, index) => (
                            <CarouselItem key={tour.slug} className="pl-8 md:basis-1/2">
                                <TourCard tour={tour} index={index} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation below the track, matching the destinations carousel */}
                    {itineraries.length > 2 && (
                        <div className="flex justify-end gap-4 mt-14">
                            <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                            <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
                        </div>
                    )}
                </Carousel>
            </div>
        </section>
    );
}
