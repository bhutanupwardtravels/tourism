"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface DayHeroProps {
    dayNumber: number;
    title: string;
    image: string;
    tourTitle: string;
}

export function DayHero({ dayNumber, title, image, tourTitle }: DayHeroProps) {
    const paddedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;

    // Day titles are written as "<Place> – <what happens there>", so the dash is
    // the natural place to break the two-tone headline the other heroes get from
    // alternating words. Alternating here lands the accent on "in", "&" and the
    // dash itself, which reads as a mistake rather than as emphasis. Titles
    // without a dash fall back to accenting everything after the first word.
    const [lead, ...restParts] = title.split(/\s+[–—-]\s+/);
    const rest = restParts.join(" — ");
    const leadWords = lead.split(" ");
    const head = rest ? lead : leadWords[0];
    const accent = rest || leadWords.slice(1).join(" ");

    // Same 90vh floor as the tour hero this page hangs off, so stepping from the
    // tour into a day does not land on a visibly shorter banner.
    return (
        <div className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
            {/* Background Image with Color Reveal */}
            <div className="absolute inset-0">
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover saturate-[1.1] contrast-[1.1]"
                    />
                )}
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-white via-90%" />
                <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-blue-500/5 mix-blend-overlay" />
                {/* Flat scrim: the vertical gradient goes fully transparent through
                   the middle of the hero, which is exactly where the headline sits. */}
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Animated Light Leak */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen"
            />

            {/* Background Large Text — decorative tint only, never a competitor
                to the headline sitting on top of it. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
            >
                {`Day ${paddedDay}`}
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
                <span className="font-mono text-amber-400 text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    {`// day ${paddedDay} : ${tourTitle}`}
                </span>

                <h1 className="mb-10 text-balance text-[clamp(2.25rem,6.5vw,5rem)] font-light uppercase leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
                    <span className="text-white">{head}</span>
                    {accent && (
                        <>
                            {" "}
                            <span className="italic font-serif normal-case text-amber-500">
                                {accent}
                            </span>
                        </>
                    )}
                </h1>

                <div className="flex items-center justify-center gap-4 md:gap-8">
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="hidden sm:block h-px bg-linear-to-r from-transparent to-amber-500"
                    />
                    <span className="font-mono text-xs tracking-[0.4em] uppercase text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                        Fully guided day
                    </span>
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="hidden sm:block h-px bg-linear-to-l from-transparent to-amber-500"
                    />
                </div>
            </div>
        </div>
    );
}
