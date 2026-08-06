"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import * as React from "react";
import { Testimonial } from "@/app/admin/testimonials/schema";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="h-full flex flex-col justify-between bg-white border border-black/10 p-8 md:p-10">
      <Quote className="w-8 h-8 text-amber-500/40 mb-6" />
      <p className="text-lg md:text-xl font-light leading-relaxed text-black italic mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center justify-between border-t border-black/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-zinc-500">
            {testimonial.avatar ? (
              <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
            ) : (
              testimonial.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-black">{testimonial.name}</span>
            {testimonial.role && (
              <span className="text-[10px] text-gray-400 uppercase font-medium tracking-tight">
                {testimonial.role}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`w-3.5 h-3.5 ${
                value <= Math.round(testimonial.rating) ? "fill-amber-500 text-amber-500" : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-neutral-50 border-t border-black/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Trust
          </span>
          <span className="text-[25vw] font-bold uppercase leading-none tracking-tighter block pr-20 text-black">
            Trust
          </span>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-6 block">
              // traveler stories
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-tight mb-8 text-black">
              What Our <span className="italic font-serif normal-case text-amber-600">Travelers Say</span>
            </h2>
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
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-8 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center gap-4 mt-16">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
            <CarouselNext className="static translate-y-0 h-14 w-14 bg-transparent hover:bg-black/5 text-black rounded-none border border-black/10 hover:border-black/30 transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
