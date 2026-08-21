"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { FadeImage } from "@/components/common/fade-image";
import { Reveal } from "@/components/ui/reveal";
import type { TourDay } from "../../schema";

interface DayNavProps {
    slug: string;
    prev?: TourDay;
    next?: TourDay;
    /** Days carry no image of their own on older tours; the tour's stands in. */
    fallbackImage: string;
}

const pad = (day: number) => (day < 10 ? `0${day}` : `${day}`);

function DayCard({
    slug,
    day,
    direction,
    fallbackImage,
}: {
    slug: string;
    day: TourDay;
    direction: "prev" | "next";
    fallbackImage: string;
}) {
    const isPrev = direction === "prev";
    const Arrow = isPrev ? ArrowLeft : ArrowRight;

    return (
        <Reveal y={30} duration={0.8}>
            <Link href={`/tours/${slug}/day/${day.day}`} className="group relative block">
                <div className="relative mb-8 aspect-16/10 overflow-hidden rounded-xs border border-black/5 bg-neutral-100 transition-colors duration-500">
                    <FadeImage
                        src={day.image || fallbackImage}
                        alt={day.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover duration-1000 saturate-[1.2] brightness-[1.1] group-hover:scale-110"
                    />
                    <span
                        className={`absolute top-6 ${
                            isPrev ? "left-6" : "right-6"
                        } z-20 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 shadow-lg backdrop-blur-sm`}
                    >
                        {isPrev ? "Previous day" : "Next day"}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="mb-4 flex items-center gap-2 text-[13px] font-medium text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-amber-600/60" />
                            Day {pad(day.day)}
                        </div>

                        <h3 className="text-2xl font-light uppercase tracking-tighter text-black transition-all duration-500 line-clamp-2 group-hover:italic md:text-3xl">
                            {day.title}
                        </h3>
                    </div>

                    <div className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 transition-colors group-hover:border-amber-500">
                        <Arrow
                            className={`h-5 w-5 text-black transition-transform group-hover:text-amber-500 ${
                                isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                            }`}
                        />
                    </div>
                </div>

                <p className="mt-6 text-md font-light italic leading-relaxed text-gray-500 line-clamp-2">
                    &quot;{day.description}&quot;
                </p>
            </Link>
        </Reveal>
    );
}

/**
 * Holds the empty half of the row when a day sits at either end of the trip.
 * Same aspect as a card's image so the two halves line up rather than leaving
 * one side visibly short.
 */
function EdgeTile({ label }: { label: string }) {
    return (
        <div className="flex aspect-16/10 items-center justify-center rounded-xs border border-black/5 bg-neutral-50/50 p-10">
            <span className="text-center font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
                {label}
            </span>
        </div>
    );
}

export function DayNav({ slug, prev, next, fallbackImage }: DayNavProps) {
    if (!prev && !next) return null;

    return (
        <div>
            <div className="mb-16 max-w-3xl">
                <span className="mb-4 block font-mono text-xs uppercase tracking-[0.4em] text-amber-600">
                    {"// keep going"}
                </span>
                <h2 className="text-4xl font-light uppercase leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                    Continue the{" "}
                    <span className="font-serif italic normal-case text-amber-600">journey</span>
                </h2>
            </div>

            {/* Two columns held even when a day is missing, so previous always
                reads on the left and next on the right. */}
            <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-8 lg:gap-12">
                {prev ? (
                    <DayCard slug={slug} day={prev} direction="prev" fallbackImage={fallbackImage} />
                ) : (
                    <EdgeTile label="Start of the itinerary" />
                )}
                {next ? (
                    <DayCard slug={slug} day={next} direction="next" fallbackImage={fallbackImage} />
                ) : (
                    <EdgeTile label="End of the itinerary" />
                )}
            </div>
        </div>
    );
}
