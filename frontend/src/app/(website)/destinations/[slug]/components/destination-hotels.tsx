"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hotel } from "../../schema";
import { HotelCard } from "@/components/common/hotel-card";

interface DestinationHotelsProps {
  hotels: Hotel[];
}

export function DestinationHotels({ hotels }: DestinationHotelsProps) {
  const [displayCount, setDisplayCount] = useState(6);

  if (hotels.length === 0) return null;

  const sortedHotels = [...hotels].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const displayedHotels = sortedHotels.slice(0, displayCount);
  const hasMore = displayCount < sortedHotels.length;

  return (
    <section className="py-40 bg-[#faf9f6] text-black relative border-t border-black/5 overflow-hidden">
      {/* Abstract Organic Topography - Seamless Fading */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#faf9f6] via-transparent to-[#faf9f6] z-10" />
        <svg width="100%" height="100%" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g fill="none" stroke="black" strokeWidth="1">
            <path d="M1100 0 C 1150 150, 1350 200, 1300 350 S 1100 500, 1200 650 S 1350 850, 1300 1000" />
            <path d="M1050 0 C 1100 160, 1300 210, 1250 360 S 1050 510, 1150 660 S 1300 860, 1250 1010" />
            <path d="M400 1000 C 350 850, 150 800, 200 650 S 400 500, 305 350 S 150 200, 200 0" />
            <path d="M350 1010 C 300 860, 100 810, 150 660 S 350 510, 255 360 S 100 210, 150 10" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="block font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4"
          >
            // plan your stay
          </motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter uppercase text-black leading-tight">
            Where to <span className="italic font-serif normal-case text-amber-600">Stay</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayedHotels.map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-24">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="backdrop-blur-md border border-black/10 text-black px-12 py-5 font-mono text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Load More Hotels
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
