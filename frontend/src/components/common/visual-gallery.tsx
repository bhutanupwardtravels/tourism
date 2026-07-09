"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface VisualGalleryProps {
    images: string[];
    title?: string;
    subtitle?: string;
}

export function VisualGallery({ images, title = "Visual Experience", subtitle = "// curated moments" }: VisualGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

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

    // Transition for the "Growth" animation
    const entranceTransition = {
        type: "spring" as const,
        stiffness: 45,
        damping: 18,
        mass: 1
    };

    return (
        <section ref={containerRef} className="py-20 bg-white relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl h-full">

                {/* Restored Header */}
                <div className="mb-32 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-mono text-amber-600 text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block"
                    >
                        {subtitle}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-light tracking-tighter leading-tight uppercase text-black"
                    >
                        {title.split(' ')[0]} <span className="italic font-serif normal-case text-amber-600">{title.split(' ').slice(1).join(' ')}</span>
                    </motion.h2>
                </div>

                {/* 
                   Structured Mosaic Layout matching the reference image:
                   - Column 1: Left Stack
                   - Column 2: Center Hero + Row below
                   - Column 3: Right Stack
                */}
                <div className="relative w-full aspect-16/10 md:aspect-video flex items-center justify-center">

                    {/* 0. Main Center Hero */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ ...entranceTransition, delay: 0.1 }}
                        className="absolute top-0 left-[22%] w-[56%] h-[53%] z-10 cursor-pointer overflow-hidden "
                        onClick={() => openLightbox(0)}
                    >
                        <motion.img
                            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }}
                            src={images[0]}
                            className="w-full h-full object-cover"
                            alt="Gallery Hero"
                        />
                    </motion.div>

                    {/* 1. Left Column - Top */}
                    {images[1] && (
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, x: -20 }}
                            whileInView={{ scale: 1, opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.2 }}
                            className="absolute top-[15%] left-0 w-[17%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(1)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [10, -10]) }}
                                src={images[1]}
                                className="w-full h-full object-contain"
                                alt="Gallery detail L1"
                            />
                        </motion.div>
                    )}

                    {/* 2. Left Column - Bottom (Portrait) */}
                    {images[2] && (
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, x: -20, y: 20 }}
                            whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.3 }}
                            className="absolute top-[48%] left-0 w-[20%] h-[45%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(2)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [30, -30]) }}
                                src={images[2]}
                                className="w-full h-full object-contain"
                                alt="Gallery detail L2"
                            />
                        </motion.div>
                    )}

                    {/* 3. Bottom Middle - Left half */}
                    {images[3] && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 30 }}
                            whileInView={{ scale: 1, opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.4 }}
                            className="absolute top-[56%] left-[22%] w-[32%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(3)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [0, -40]) }}
                                src={images[3]}
                                className="w-full h-full object-cover"
                                alt="Gallery detail BM1"
                            />
                        </motion.div>
                    )}

                    {/* 4. Bottom Middle - Right half (Portrait focus) */}
                    {images[4] && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 30 }}
                            whileInView={{ scale: 1, opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.5 }}
                            className="absolute top-[56%] left-[56%] w-[22%] h-[42%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(4)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [20, -50]) }}
                                src={images[4]}
                                className="w-full h-full object-cover"
                                alt="Gallery detail BM2"
                            />
                        </motion.div>
                    )}

                    {/* 5. Right Column - Top */}
                    {images[5] && (
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, x: 20 }}
                            whileInView={{ scale: 1, opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.25 }}
                            className="absolute top-[5%] right-[2%] w-[16%] h-[22%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(5)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [-10, 10]) }}
                                src={images[5]}
                                className="w-full h-full object-cover"
                                alt="Gallery detail R1"
                            />
                        </motion.div>
                    )}

                    {/* 6. Right Column - Middle */}
                    {images[6] && (
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, x: 20 }}
                            whileInView={{ scale: 1, opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.35 }}
                            className="absolute top-[32%] right-[2%] w-[24%] h-[28%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(6)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]) }}
                                src={images[6]}
                                className="w-full h-full object-cover"
                                alt="Gallery detail R2"
                            />
                        </motion.div>
                    )}

                    {/* 7. Right Column - Bottom */}
                    {images[7] && (
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, x: 20, y: 20 }}
                            whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ ...entranceTransition, delay: 0.45 }}
                            className="absolute top-[65%] right-[2%] w-[22%] h-[18%] z-10 cursor-pointer overflow-hidden"
                            onClick={() => openLightbox(7)}
                        >
                            <motion.img
                                style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
                                src={images[7]}
                                className="w-full h-full object-contain"
                                alt="Gallery detail R3"
                            />
                        </motion.div>
                    )}
                </div>

                {images.length > 8 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="absolute bottom-10 right-10 z-50 flex items-center gap-4 text-white/50 hover:text-white transition-colors"
                        onClick={() => openLightbox(8)}
                    >
                        <span className="font-mono text-[10px] uppercase tracking-widest">+ {images.length - 8} Moments</span>
                        <Maximize2 className="w-4 h-4" />
                    </motion.button>
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
                                <span className="font-mono text-amber-600 text-[10px] uppercase tracking-[0.5em] font-bold">
                                    Gallery Explorer
                                </span>
                                <span className="h-px w-10 bg-white/10" />
                                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">
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
                                    alt={`Gallery Image ${selectedImage + 1}`}
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
                                        className={`w-20 h-14 rounded-sm overflow-hidden border-2 transition-all duration-500 ${selectedImage === idx ? "border-amber-600 scale-110 shadow-lg" : "border-transparent opacity-30 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
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
