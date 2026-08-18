"use client";

import { motion } from "framer-motion";
import { MissionItem } from "../schema";
import { Reveal } from "@/components/ui/reveal";

interface OurMissionProps {
  items: MissionItem[];
  title?: string;
  subtitle?: string;
}

export function OurMission({ items, title, subtitle }: OurMissionProps) {
  const titleWords = (title || "Mission Parameters").split(" ");

  return (
    <section className="py-40 bg-neutral-950 text-white relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="missionGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#missionGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 pb-12 border-b border-white/5">
          <div className="max-w-2xl">
            <span className="font-mono text-amber-500 text-xs uppercase tracking-[0.5em] mb-4 block">
              // {subtitle || "what we stand for"}
            </span>
            <h2 className="text-5xl md:text-[6rem] font-light tracking-tighter uppercase leading-none">
              {titleWords[0]} <span className="italic font-serif normal-case text-amber-500">{titleWords.slice(1).join(" ")}</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {items.map((item, index) => (
            <Reveal y={0} scale={0.98} delay={index * 0.2} duration={1}
              key={item.id}
              className="group relative p-12 border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-700">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-amber-500/0 group-hover:border-amber-500/40 transition-all duration-700" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-amber-500/0 group-hover:border-amber-500/40 transition-all duration-700" />

              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <span className="font-mono text-amber-500 text-xs opacity-40">ITEM: 0{index + 1}</span>
                  <div className="h-px flex-1 bg-white/5 group-hover:bg-amber-500/20 transition-all duration-700" />
                </div>

                <h3 className="text-3xl md:text-4xl font-light tracking-tight uppercase group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-400 font-light leading-relaxed italic text-lg line-clamp-4 group-hover:text-gray-200 transition-colors">
                  "{item.description}"
                </p>

              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Dynamic Scan Line */}
      <motion.div
        animate={{ left: ["-10%", "110%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-px bg-linear-to-b from-transparent via-amber-500/20 to-transparent pointer-events-none"
      />
    </section>
  );
}

