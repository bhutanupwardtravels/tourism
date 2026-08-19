"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import * as React from "react";
import { Testimonial } from "@/app/admin/testimonials/schema";
import { Reveal } from "@/components/ui/reveal";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`w-3.5 h-3.5 ${
            value <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialIdentity({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex items-center justify-between border-t border-black/5 pt-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-zinc-500">
          {testimonial.avatar ? (
            <Image src={testimonial.avatar} alt={testimonial.name} width={44} height={44} className="w-full h-full object-cover" />
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
      <Rating rating={testimonial.rating} />
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onDialogOpenChange,
}: {
  testimonial: Testimonial;
  onDialogOpenChange?: (open: boolean) => void;
}) {
  const quoteRef = React.useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = React.useState(false);

  // The quote is clamped to a fixed number of lines so every card is the same
  // height; only show the "read full story" affordance when text is cut off.
  React.useEffect(() => {
    const element = quoteRef.current;
    if (!element) return;

    const check = () => setIsClamped(element.scrollHeight - element.clientHeight > 1);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(element);
    document.fonts?.ready.then(check).catch(() => {});

    return () => observer.disconnect();
  }, [testimonial.quote]);

  return (
    <div className="h-full flex flex-col bg-white border border-black/10 p-8 md:p-10">
      <Quote className="w-8 h-8 text-amber-500/40 mb-6" />
      <div className="flex-1">
        <p
          ref={quoteRef}
          className="text-base font-light leading-relaxed text-black italic line-clamp-5"
        >
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        {isClamped && (
          <Dialog onOpenChange={onDialogOpenChange}>
            <DialogTrigger className="group mt-5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 hover:text-black transition-colors cursor-pointer">
              <span className="h-px w-8 bg-amber-600/40 group-hover:w-14 group-hover:bg-black transition-all duration-500" />
              Read full story
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-none border-black/10 bg-white text-black p-8 md:p-10 gap-0">
              <DialogTitle className="sr-only">
                Traveler story from {testimonial.name}
              </DialogTitle>
              <Quote className="w-8 h-8 text-amber-500/40 mb-6" />
              <p className="text-base font-light leading-relaxed text-black italic whitespace-pre-line mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <TestimonialIdentity testimonial={testimonial} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="mt-8">
        <TestimonialIdentity testimonial={testimonial} />
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-neutral-50 border-t border-black/5 relative overflow-hidden">
      <div aria-hidden className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
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
          <Reveal y={30} duration={0.8}>
            <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] mb-6 block">
              {"// traveler stories"}
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-tight mb-8 text-black">
              What Our <span className="italic font-serif normal-case text-amber-600">Travelers Say</span>
            </h2>
          </Reveal>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-8 items-stretch">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-8 md:basis-1/2 lg:basis-1/3"
              >
                <Reveal y={30} duration={0.8}
                  className="h-full">
                  <TestimonialCard testimonial={testimonial} onDialogOpenChange={setIsPaused} />
                </Reveal>
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
