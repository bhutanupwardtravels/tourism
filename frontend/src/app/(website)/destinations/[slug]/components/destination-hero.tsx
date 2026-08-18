"use client";

import Image from "next/image";

import { motion } from "framer-motion";

interface DestinationHeroProps {
  name: string;
  image: string;
  region: string;
}

export function DestinationHero({ name, image }: DestinationHeroProps) {
  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
      {/* Background Image with Color */}
      <div className="absolute inset-0">
        {image && (
            <Image
                src={image}
                alt={name}
                fill
                sizes="100vw"
                priority
                className="object-cover"
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

      {/* Background Large Text — decorative tint only. At full amber it swallowed
          the headline sitting on top of it, so it stays faint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
      >
        {name}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
          <span className="font-mono text-amber-400 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            {"// exploring: {region}"}
          </span>
          <h1 className="mb-10 text-balance text-[clamp(2.5rem,8vw,6.5rem)] font-light uppercase leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
            {name.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-100" : "text-white"}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden sm:block h-px bg-linear-to-r from-transparent to-amber-500"
            />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Mission Parameters Verified</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden sm:block h-px bg-linear-to-l from-transparent to-amber-500"
            />
          </div>
      </div>

      <div className="absolute bottom-12 left-12 z-10 hidden flex-col items-start gap-4 xl:flex">
        <div className="font-mono text-[9px] tracking-[0.3em] text-amber-200/80 uppercase space-y-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
            lat: 27.5142° n
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse delay-75" />
            long: 90.4336° e
          </p>
        </div>
        <div className="w-px h-16 bg-linear-to-b from-amber-500/50 to-transparent" />
      </div>

      <div className="absolute bottom-12 right-12 z-10 hidden items-center gap-6 xl:flex">
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          Plan Your <span className="text-amber-400">Journey</span>
        </span>
        <div className="w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}
