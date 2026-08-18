"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Hero } from "../schema";

interface AboutHeroProps {
  hero: Hero;
}

export function AboutHero({ hero }: AboutHeroProps) {
  const titleWords = hero.title.split(' ');

  return (
    <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pb-28 pt-36 md:pt-44">
      {/* Background Image with Cinematic Overlays */}
      <div className="absolute inset-0 z-0">
        {hero.backgroundImage && (
            <Image
                src={hero.backgroundImage}
                alt="Bhutan landscape"
                fill
                sizes="100vw"
                priority
                className="object-cover"
            />
        )}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-blue-500/10 mix-blend-overlay" />
      </div>

      {/* Animated Light Leak */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full mix-blend-screen z-10"
      />

      {/* Background Large Text — a tint behind the headline, never a competitor
          to it. Full-strength amber at 25vw made the two words unreadable on top
          of each other, so it stays faint and clipped to the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 select-none text-center text-[16vw] font-bold uppercase leading-none tracking-tighter text-amber-500/15 whitespace-nowrap"
      >
        {hero.title}
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">
          <div>
            <span className="font-mono text-amber-400 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              {"// {hero.subtitle}"}
            </span>
          </div>

          <div>
            <h1 className="mb-8 text-balance text-[clamp(2.5rem,8vw,6.5rem)] font-light uppercase leading-[0.95] tracking-tighter drop-shadow-2xl">
              {titleWords.map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "italic font-serif normal-case text-amber-500" : "text-white"}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>

          <div>
            <p className="max-w-2xl text-balance text-base md:text-xl text-gray-200 font-light leading-relaxed font-serif italic mx-auto">
              &ldquo;{hero.description}&rdquo;
            </p>
          </div>

          {/* Mission Parameters Indicator */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-12 md:mt-16">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden sm:block h-px bg-linear-to-r from-transparent to-amber-500"
            />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gray-400">Bhutan Upward Travels</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden sm:block h-px bg-linear-to-l from-transparent to-amber-500"
            />
          </div>
      </div>

      {/* Side metadata */}
      <div className="absolute bottom-12 left-12 z-20 hidden flex-col items-start gap-4 xl:flex">
        <div className="font-mono text-[8px] tracking-[0.3em] text-amber-200/70 uppercase space-y-2">
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
            Kingdom of Bhutan
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse delay-75" />
            Local specialists
          </p>
        </div>
        <div className="w-px h-16 bg-linear-to-b from-amber-500/50 to-transparent" />
      </div>

      {/* Bottom Right Action Indicator */}
      <div className="absolute bottom-12 right-12 z-20 hidden items-center gap-6 xl:flex">
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gray-300">
          Scroll to <span className="text-amber-400">Explore</span>
        </span>
        <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          />
        </div>
      </div>
    </section>
  );
}
