"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

interface VisualGalleryProps {
    images: string[];
    title?: string;
    subtitle?: string;
    /** Entity name (hotel/experience title) used to build descriptive alt text per photo. */
    imageAlt?: string;
}

export function VisualGallery({ images, title = "Visual Experience", subtitle = "// curated moments", imageAlt }: VisualGalleryProps) {
    const altFor = (index: number) =>
        imageAlt ? `${imageAlt} — photo ${index + 1}` : `Gallery photo ${index + 1}`;

    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // One parallax transform per mosaic slot, declared unconditionally and in a
    // fixed order: the tiles below render conditionally on `images[n]`, so these
    // hooks cannot live inside those branches without breaking hook ordering
    // whenever the gallery is handed a different number of images.
    const parallaxY = [
        useTransform(scrollYProgress, [0, 1], [0, -20]),
        useTransform(scrollYProgress, [0, 1], [10, -10]),
        useTransform(scrollYProgress, [0, 1], [30, -30]),
        useTransform(scrollYProgress, [0, 1], [0, -40]),
        useTransform(scrollYProgress, [0, 1], [20, -50]),
        useTransform(scrollYProgress, [0, 1], [-10, 10]),
        useTransform(scrollYProgress, [0, 1], [-20, 20]),
        useTransform(scrollYProgress, [0, 1], [-30, 30]),
    ];

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = "auto";
    };

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length);
        }
    };

    return (
        <section ref={containerRef} className="py-20 bg-white relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl h-full">

                {/* Restored Header */}
                <div className="mb-32 text-center">
                    <Reveal as="span" y={0}
                        className="font-mono text-amber-600 text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
                        {subtitle}
                    </Reveal>
                    <Reveal as="h2" y={20}
                        className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black">
                        {title.split(' ')[0]} <span className="italic font-serif normal-case text-amber-600">{title.split(' ').slice(1).join(' ')}</span>
                    </Reveal>
                </div>

                {/* 
                   Structured Mosaic Layout matching the reference image:
                   - Column 1: Left Stack
                   - Column 2: Center Hero + Row below
                   - Column 3: Right Stack
                */}
                <div className="relative w-full aspect-16/10 md:aspect-video flex items-center justify-center">

                    {/* 0. Main Center Hero */}
                    <Reveal y={0} scale={0.8} delay={0.1}
                        className="absolute top-0 left-[22%] w-[56%] h-[53%] z-10 cursor-pointer overflow-hidden "
                        onClick={() => openLightbox(0)}>
                        <motion.img
                            style={{ y: parallaxY[0] }}
                            src={images[0]}
                            className="w-full h-full object-cover"
                            alt={altFor(0)}
                        />
                    </Reveal>

                    {/* 1. Left Column - Top */}
                    {images[1] && (
                        <Reveal y={0} x={-20} scale={0.7} delay={0.2}
                            className="absolute top-[15%] left-0 w-[17%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(1)}>
                            <motion.img
                                style={{ y: parallaxY[1] }}
                                src={images[1]}
                                className="w-full h-full object-contain"
                                alt={altFor(1)}
                            />
                        </Reveal>
                    )}

                    {/* 2. Left Column - Bottom (Portrait) */}
                    {images[2] && (
                        <Reveal y={20} x={-20} scale={0.7} delay={0.3}
                            className="absolute top-[48%] left-0 w-[20%] h-[45%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(2)}>
                            <motion.img
                                style={{ y: parallaxY[2] }}
                                src={images[2]}
                                className="w-full h-full object-contain"
                                alt={altFor(2)}
                            />
                        </Reveal>
                    )}

                    {/* 3. Bottom Middle - Left half */}
                    {images[3] && (
                        <Reveal y={30} scale={0.8} delay={0.4}
                            className="absolute top-[56%] left-[22%] w-[32%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(3)}>
                            <motion.img
                                style={{ y: parallaxY[3] }}
                                src={images[3]}
                                className="w-full h-full object-cover"
                                alt={altFor(3)}
                            />
                        </Reveal>
                    )}

                    {/* 4. Bottom Middle - Right half (Portrait focus) */}
                    {images[4] && (
                        <Reveal y={30} scale={0.8} delay={0.5}
                            className="absolute top-[56%] left-[56%] w-[22%] h-[42%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(4)}>
                            <motion.img
                                style={{ y: parallaxY[4] }}
                                src={images[4]}
                                className="w-full h-full object-cover"
                                alt={altFor(4)}
                            />
                        </Reveal>
                    )}

                    {/* 5. Right Column - Top */}
                    {images[5] && (
                        <Reveal y={0} x={20} scale={0.7} delay={0.25}
                            className="absolute top-[5%] right-[2%] w-[16%] h-[22%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(5)}>
                            <motion.img
                                style={{ y: parallaxY[5] }}
                                src={images[5]}
                                className="w-full h-full object-cover"
                                alt={altFor(5)}
                            />
                        </Reveal>
                    )}

                    {/* 6. Right Column - Middle */}
                    {images[6] && (
                        <Reveal y={0} x={20} scale={0.7} delay={0.35}
                            className="absolute top-[32%] right-[2%] w-[24%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(6)}>
                            <motion.img
                                style={{ y: parallaxY[6] }}
                                src={images[6]}
                                className="w-full h-full object-cover"
                                alt={altFor(6)}
                            />
                        </Reveal>
                    )}

                    {/* 7. Right Column - Bottom */}
                    {images[7] && (
                        <Reveal y={20} x={20} scale={0.7} delay={0.45}
                            className="absolute top-[65%] right-[2%] w-[22%] h-[18%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(7)}>
                            <motion.img
                                style={{ y: parallaxY[7] }}
                                src={images[7]}
                                className="w-full h-full object-contain"
                                alt={altFor(7)}
                            />
                        </Reveal>
                    )}
                </div>

                {images.length > 8 && (
                    <Reveal as="button" y={0}
                        className="absolute bottom-10 right-10 z-50 flex items-center gap-4 text-white/50 hover:text-white transition-colors"
                        onClick={() => openLightbox(8)}>
                        <span className="font-mono text-xs uppercase tracking-widest">+ {images.length - 8} Moments</span>
                        <Maximize2 className="w-4 h-4" />
                    </Reveal>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-black flex flex-col"
                    >
                        <div className="p-8 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-amber-600 text-xs uppercase tracking-[0.5em] font-bold">
                                    Gallery Explorer
                                </span>
                                <span className="h-px w-10 bg-white/10" />
                                <span className="font-mono text-xs text-white/40 uppercase tracking-widest font-bold">
                                    Frame {selectedImage + 1} / {images.length}
                                </span>
                            </div>
                            <button
                                onClick={closeLightbox}
                                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center p-6 md:p-24 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05, y: -20 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    src={images[selectedImage]}
                                    className="max-w-full max-h-full object-contain rounded-sm"
                                    alt={altFor(selectedImage)}
                                />
                            </AnimatePresence>

                            <button
                                onClick={prevImage}
                                className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all group"
                            >
                                <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all group"
                            >
                                <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="p-8 border-t border-white/5 overflow-x-auto">
                            <div className="flex justify-center gap-4 min-w-max px-6">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-14 rounded-sm overflow-hidden border-2 transition-all duration-500 ${selectedImage === idx ? "border-amber-600 scale-110 shadow-lg" : "border-transparent opacity-30 hover:opacity-100"
                                            }`}
                                    >
                                        {img && (
                                            <Image
                                                src={img}
                                                alt={altFor(idx)}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
