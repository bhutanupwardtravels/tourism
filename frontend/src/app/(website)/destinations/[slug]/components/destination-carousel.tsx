"use client";

import { motion } from "framer-motion";
import { Destination } from "../../schema";
import { DestinationCard } from "@/components/common/destination-card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";

interface DestinationCarouselProps {
  destinations: Destination[];
  currentSlug: string;
}

export function DestinationCarousel({
  destinations,
  currentSlug,
}: DestinationCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollPrev();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  // Filter out current destination, sort by priority, and take top 6
  const otherDestinations = destinations
    .filter((d) => d.slug !== currentSlug)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99))
    .slice(0, 6);

  if (otherDestinations.length === 0) return null;

  return (
    <section className="py-24 md:py-40 relative overflow-hidden border-t border-black/5">
      {/* Noise Grain Texture */}
      {/* <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div> */}

      {/* Soft Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.02) 100%) pointer-events-none" />
      {/* Decorative Background Text - Seamless Loop */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
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
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              // explore more
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black">
              Other <span className="italic font-serif normal-case text-amber-600">Regions</span>
            </h2>
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
            {otherDestinations.map((dest, index) => (
              <CarouselItem
                key={dest.slug}
                className="pl-8 md:basis-1/2 lg:basis-1/2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DestinationCard destination={dest as any} index={index} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-4 mt-16">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
            <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
