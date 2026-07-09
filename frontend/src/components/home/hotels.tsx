"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hotel } from "@/app/admin/hotels/schema";
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

interface BestHotelsProps {
  hotels: Hotel[];
}

export function BestHotels({ hotels }: BestHotelsProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollPrev();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  if (!hotels || hotels.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white border-t border-black/5 relative overflow-hidden">
      {/* Decorative Background Text - Seamless Loop (Right to Left) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Stay
          </span>
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Stay
          </span>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-6 block">
              // where to stay
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-tight mb-8 text-black">
              Best <span className="italic font-serif normal-case text-amber-600">Hotels</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <Link
              href="/hotels"
              className="group inline-flex items-center gap-2 text-[10px] font-mono font-medium tracking-[0.3em] uppercase hover:text-amber-600 transition-all text-gray-400 border-b border-transparent hover:border-amber-600 pb-1"
            >
              View All Hotels
            </Link>
          </motion.div>
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
            {hotels.map((hotel, index) => (
              <CarouselItem
                key={hotel.id}
                className="pl-8 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HotelCard hotel={hotel} index={index} />
                </motion.div>
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
