"use client";

import { motion } from "framer-motion";
import { SustainabilityItem } from "../schema";

interface SustainableTravelProps {
  items: SustainabilityItem[];
  intro?: string;
  subtitle?: string;
}

export function SustainableTravel({ items, intro, subtitle }: SustainableTravelProps) {
  return (
    <section className="py-40 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-linear-to-t from-amber-500/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="block font-mono text-amber-500 text-xs uppercase tracking-[0.5em] mb-6"
          >
            // {subtitle || "philosophical framework"}
          </motion.span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-tight mb-8">
            Conservation <span className="italic font-serif normal-case text-amber-500">Protocol</span>
          </h2>
          {intro && (
            <p className="max-w-3xl mx-auto text-xl text-gray-400 font-light leading-relaxed italic">
              "{intro}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-10 border border-white/5 bg-white/2 hover:border-amber-500/30 transition-all duration-700"
            >
              <div className="mb-10 flex items-center justify-between">
                <div className="font-mono text-[10px] text-amber-500/40">REF: 00{item.order}</div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:animate-ping opacity-20 group-hover:opacity-100" />
              </div>

              <h4 className="text-2xl font-light text-white mb-6 uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                {item.title}
              </h4>
              <p className="text-gray-400 leading-relaxed font-light text-sm group-hover:text-gray-200 transition-colors">
                {item.description}
              </p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent group-hover:via-amber-500/30 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

