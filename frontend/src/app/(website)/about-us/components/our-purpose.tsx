"use client";

import { motion } from "framer-motion";
import { AboutSection } from "../schema";

interface OurPurposeProps {
  purpose: AboutSection;
}

export function OurPurpose({ purpose }: OurPurposeProps) {
  const titleWords = purpose.title.split(' ');

  return (
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          {/* Visual Evidence - Reversed Order */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group order-2 lg:order-1"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
              <img
                src={purpose.image || "https://images.unsplash.com/photo-1528127269322-539801943592?w=2940&auto=format&fit=crop"}
                alt={purpose.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />

              {/* Tactical Overlay */}
              <div className="absolute inset-0 border border-black/5" />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 border border-black/10">
                <p className="font-mono text-[8px] text-black tracking-[0.3em] uppercase">Status: Core Philosophy</p>
              </div>

              {/* Pulse Effect */}
              <div className="absolute top-8 right-8 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            </div>

            {/* Corner Brackets */}
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-black/10 group-hover:border-amber-600/30 transition-colors" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-black/10 group-hover:border-amber-600/30 transition-colors" />
          </motion.div>

          {/* Narrative Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] mb-6 block">
              // {purpose.subtitle || "The Purpose"}
            </span>

            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase text-black">
              {titleWords[0]} <span className="italic font-serif normal-case text-amber-600">{titleWords.slice(1).join(' ')}</span>
            </h2>

            <div className="relative pl-12 border-l border-black/10">
              <div className="space-y-8 text-xl text-gray-500 leading-relaxed font-light italic">
                {purpose.content.map((paragraph, index) => (
                  <p key={index}>"{paragraph}"</p>
                ))}
              </div>

              {/* Tactical Corner */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-600/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

