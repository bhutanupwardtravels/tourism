"use client";

import { motion } from "framer-motion";
import { ExperienceCard } from "@/components/common/experience-card";
import { Experience } from "@/app/admin/experiences/schema";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";
import { Reveal } from "@/components/ui/reveal";

interface ExperienceCarouselProps {
  experiences: Experience[];
  currentSlug: string;
}

export function ExperienceCarousel({
  experiences,
  currentSlug,
}: ExperienceCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollPrev();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  // Filter out current experience, sort by priority (descending), and take top 6
  const otherExperiences = experiences
    .filter((e) => e.slug !== currentSlug)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 6);

  if (otherExperiences.length === 0) return null;

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
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Reveal as="span" y={0} x={-20}
              className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
              // more experiences
            </Reveal>
            <Reveal as="h2" y={20} delay={0.1}
              className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black">
              Other <span className="italic font-serif normal-case text-amber-600">Experiences</span>
            </Reveal>
          </div>
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
            {otherExperiences.map((experience, index) => (
              <CarouselItem
                key={experience.slug}
                className="pl-8 md:basis-1/2 lg:basis-1/3"
              >
                <Reveal y={30} delay={index * 0.1} duration={0.8}>
                  <ExperienceCard
                    experience={experience as any}
                    index={index}
                  />
                </Reveal>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-start gap-4 mt-16">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
            <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
