"use client";

import { motion } from "framer-motion";
import {
  Smile,
  Mountain,
  Heart,
  Sparkles,
  Leaf,
  Key,
  LucideIcon,
} from "lucide-react";
import { WhyBhutanItem } from "../schema";

interface WhyBhutanProps {
  items: WhyBhutanItem[];
}

const iconMap: Record<string, LucideIcon> = {
  smile: Smile,
  mountain: Mountain,
  heart: Heart,
  sparkles: Sparkles,
  leaf: Leaf,
  key: Key,
};

export function WhyBhutan({ items }: WhyBhutanProps) {
  return (
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="block font-mono text-amber-600 text-xs uppercase tracking-[0.5em] mb-4"
          >
            // unique identifiers
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-tight text-black">
            The Kingdom of <span className="italic font-serif normal-case text-amber-600">Happiness</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Smile;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-12 border border-black/5 bg-neutral-50/30 hover:bg-white hover:border-amber-600/30 hover:shadow-2xl transition-all duration-700"
              >
                <div className="mb-10 relative">
                  <div className="w-16 h-16 border border-black/10 rounded-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <IconComponent className="w-6 h-6 text-black group-hover:text-white transition-colors delay-100" />
                  </div>
                  {/* Decorative Number */}
                  <span className="absolute -top-4 -right-4 font-mono text-[10px] text-black/10 group-hover:text-amber-600/20">#{index + 1}</span>
                </div>

                <h4 className="text-2xl font-light text-black mb-6 uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-500 leading-relaxed font-light text-sm italic group-hover:text-gray-900 transition-colors">
                  "{item.description}"
                </p>

                {/* Tactical Footer */}
                <div className="mt-10 pt-6 border-t border-black/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="font-mono text-[8px] uppercase tracking-widest">Active Attribute</span>
                  <div className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

