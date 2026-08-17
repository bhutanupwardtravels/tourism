"use client";

import Image from "next/image";

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
                  {day.image && (
                      <Image
                          src={day.image}
                          alt={day.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                  )}
                </div>
              )}
              <div>
                <h3 className="text-4xl font-light mb-6 group-hover:italic transition-all duration-500 uppercase tracking-tight group-hover:translate-x-3 origin-left">
                  {day.title}
                </h3>

                <p className="text-gray-600 leading-relaxed font-light italic text-base md:text-lg mb-6 line-clamp-4">
                  "{day.description}"
                </p>

                {day.accommodation && (
                  <p className="mb-8 text-[13px] text-gray-500">
                    <span className="font-semibold text-black">Stay:</span> {day.accommodation}
                  </p>
                )}

                <div className="flex items-center gap-2 font-mono text-[10px] text-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold">
                  <Plus className="w-4 h-4 text-amber-600" /> Read the full day
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
