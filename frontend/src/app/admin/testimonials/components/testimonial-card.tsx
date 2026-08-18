"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Testimonial } from "../schema";
import { DeleteTestimonialDialog } from "./delete-testimonial-dialog";

interface TestimonialCardProps {
    testimonial: Testimonial;
    showActionsOnClick?: boolean;
}

export function TestimonialCard({ testimonial, showActionsOnClick }: TestimonialCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    return (
        <>
            <DeleteTestimonialDialog testimonial={testimonial} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
            <motion.div
                className="relative overflow-hidden bg-white border border-black/10 group cursor-pointer rounded-none p-6 flex flex-col gap-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => router.push(`/admin/testimonials/${testimonial.id || testimonial._id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-zinc-500 shrink-0">
                            {testimonial.avatar ? (
                                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                testimonial.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-zinc-900 truncate max-w-[160px]">{testimonial.name}</span>
                            <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">
                                {testimonial.role || "Traveler"}
                            </span>
                        </div>
                    </div>
                    <Badge
                        className={
                            testimonial.isFeatured
                                ? "rounded-none bg-emerald-100 text-emerald-700 border-none shrink-0"
                                : "rounded-none bg-gray-100 text-gray-500 border-none shrink-0"
                        }
                    >
                        {testimonial.isFeatured ? "On Website" : "Hidden"}
                    </Badge>
                </div>

                <Quote className="w-5 h-5 text-amber-500/30" />
                <p className="text-sm text-zinc-600 line-clamp-4 italic">{testimonial.quote}</p>

                <div className="flex items-center gap-1 border-t border-black/5 pt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                            key={value}
                            className={`w-3.5 h-3.5 ${value <= testimonial.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"}`}
                        />
                    ))}
                </div>

                <motion.div
                    className="absolute top-4 right-4 flex gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isHovered || showActionsOnClick ? 1 : 0, y: isHovered || showActionsOnClick ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Link href={`/admin/testimonials/${testimonial.id || testimonial._id}/edit`} onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" className="bg-amber-600 text-white hover:bg-amber-700 w-8 h-8 rounded-none">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        size="icon"
                        className="bg-red-500 text-white hover:bg-red-600 w-8 h-8 rounded-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </motion.div>
            </motion.div>
        </>
    );
}
