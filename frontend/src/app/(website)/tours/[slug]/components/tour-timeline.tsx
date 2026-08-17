"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TourDay } from "../../schema";

interface TourTimelineProps {
  days: TourDay[];
  slug: string;
}

/**
 * A 12-day tour used to render as 12 full-viewport blocks, so nobody could form
 * a mental model of the trip without scrolling through all of it. Each day is
 * now a scannable row that expands in place; the first is open so the pattern
 * is obvious without a click.
 */
export function TourTimeline({ days, slug }: TourTimelineProps) {
  const [openDays, setOpenDays] = useState<number[]>(days.length ? [days[0].day] : []);

  const allOpen = openDays.length === days.length;

  const toggle = (day: number) =>
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  return (
    <div className="border-t border-black/10">
      <div className="flex justify-end py-4">
        <button
          type="button"
          onClick={() => setOpenDays(allOpen ? [] : days.map((d) => d.day))}
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <ul className="border-t border-black/10">
        {days.map((day) => {
          const isOpen = openDays.includes(day.day);
          const panelId = `day-panel-${day.day}`;

          return (
            <li key={day.day} className="border-b border-black/10">
              <button
                type="button"
                onClick={() => toggle(day.day)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-center gap-6 py-6 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <span className="w-16 shrink-0 pl-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">
                  Day {day.day}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-lg md:text-xl font-normal text-black leading-snug">
                    {day.title}
                  </span>
                  {!isOpen && (
                    <span className="mt-1 block truncate text-[13px] text-gray-500">
                      {day.accommodation ? `Stay: ${day.accommodation}` : day.description}
                    </span>
                  )}
                </span>

                <ChevronDown
                  className={cn(
                    "mr-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 group-hover:text-black",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-[minmax(0,320px)_1fr] md:pl-22">
                      {day.image && (
                        <div className="relative aspect-4/3 overflow-hidden rounded-xs border border-black/5">
                          <Image
                            src={day.image}
                            alt={day.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-5">
                        <p className="text-[15px] leading-relaxed text-gray-600">
                          {day.description}
                        </p>

                        {day.accommodation && (
                          <p className="flex items-center gap-2 text-[13px] text-gray-600">
                            <MoonStar className="h-4 w-4 shrink-0 text-amber-600" />
                            <span>
                              <span className="font-semibold text-black">Stay:</span>{" "}
                              {day.accommodation}
                            </span>
                          </p>
                        )}

                        {day.activities && day.activities.length > 0 && (
                          <ul className="flex flex-wrap gap-2">
                            {day.activities.map((activity, index) => (
                              <li
                                key={index}
                                className="border border-black/10 px-3 py-1 text-[12px] text-gray-600"
                              >
                                {activity}
                              </li>
                            ))}
                          </ul>
                        )}

                        <Link
                          href={`/tours/${slug}/day/${day.day}`}
                          className="group/link inline-flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                          See day {day.day} in detail
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
