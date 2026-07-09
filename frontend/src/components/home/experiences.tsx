"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ExperienceCard } from "@/components/common/experience-card";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";

interface ExperiencesProps {
  experiences: any[]; // Use any or specific type if preferred
}

export function Experiences({ experiences }: ExperiencesProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollPrev();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-40 bg-white text-black relative overflow-hidden">
      {/* Decorative Background Text - Seamless Loop (Right to Left) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Explore
          </span>
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Explore
          </span>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 pb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-4 block"
            >
              // intel: field reports
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase"
            >
              Curated <span className="italic font-serif normal-case text-amber-600">Experiences</span>
            </motion.h3>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/experiences"
              className="group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 hover:text-black transition-colors"
            >
              <span className="h-px w-12 bg-black/20 group-hover:w-20 group-hover:bg-amber-600 transition-all duration-500" />
              Access All Files
            </Link>
          </motion.div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-8">
            {experiences.map((exp, index) => (
              <CarouselItem
                key={index}
                className="pl-8 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ExperienceCard experience={exp} index={index} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons below the carousel */}
          <div className="flex justify-start gap-4 mt-16">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
            <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

