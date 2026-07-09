"use client";

import { motion } from "framer-motion";
import { TourDay } from "../../schema";
import { Plus } from "lucide-react";
import Link from "next/link";

interface TourTimelineProps {
  days: TourDay[];
  slug: string;
}

export function TourTimeline({ days, slug }: TourTimelineProps) {
  return (
    <div className="relative space-y-32 py-12">
      {days.map((day, index) => (
        <Link
          key={day.day}
          href={`/tours/${slug}/day/${day.day}`}
          className="block group"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Day Number Label */}
            <div className="lg:col-span-1">
              <span className="font-mono text-xs text-amber-600 uppercase tracking-[0.4em] block sticky top-40 font-bold">
                // day {day.day < 10 ? `0${day.day}` : day.day}
              </span>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-l border-black/5 pl-12 pb-24 group-hover:border-amber-500/30 transition-colors duration-700">
              {day.image && (
                <div className="relative aspect-video overflow-hidden rounded-xs border border-black/5">
                  <img
                    src={day.image}
                    alt={day.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                  />
                  {/* Vibrant Overlays - Removing desaturating overlays */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

                  <div className="absolute bottom-4 left-4">
                    <span className="font-mono text-[10px] text-white tracking-widest uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 font-bold">
                      Visual Record // FRM-{day.day}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest px-3 py-1 border border-black/5 rounded-full font-bold">
                    Route Authentication Verified
                  </span>
                </div>

                <h3 className="text-4xl font-light mb-6 group-hover:italic transition-all duration-500 uppercase tracking-tight group-hover:translate-x-3 origin-left">
                  {day.title}
                </h3>

                <p className="text-gray-600 leading-relaxed font-light italic text-base md:text-lg mb-8 line-clamp-4">
                  "{day.description}"
                </p>

                <div className="flex items-center gap-2 font-mono text-[10px] text-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold">
                  <Plus className="w-4 h-4 text-amber-600" /> [ Read Detailed Briefing ]
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
