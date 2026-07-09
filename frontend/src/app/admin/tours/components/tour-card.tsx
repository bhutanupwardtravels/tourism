"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tour } from "../schema";
import { Badge } from "@/components/ui/badge";
import { DeleteTourDialog } from "./delete-tour-dialog";
import { getExperienceTypeById } from "@/app/admin/experience-types/actions";

interface TourCardProps {
    tour: Tour;
    showActionsOnClick?: boolean;
}

export function TourCard({ tour, showActionsOnClick }: TourCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [categoryName, setCategoryName] = useState<string>("Loading...");
    const router = useRouter();

    useEffect(() => {
        const categoryId = tour.category;
        if (!categoryId) {
            setCategoryName("General");
            return;
        }

        const fetchCategory = async () => {
            try {
                const experienceType = await getExperienceTypeById(categoryId);
                setCategoryName(experienceType?.title || "General");
            } catch (error) {
                setCategoryName("General");
            }
        };

        fetchCategory();
    }, [tour.category]);

    return (
        <>
            <DeleteTourDialog
                tour={tour}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <motion.div
                className="relative overflow-hidden bg-gray-900 group cursor-pointer rounded-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => router.push(`/admin/tours/${tour.id || tour._id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Image Section */}
                <div className="aspect-4/3 overflow-hidden relative">
                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-semibold text-white truncate">
                                    {tour.title}
                                </h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <Badge
                                        variant="outline"
                                        className="rounded-none uppercase text-[9px] font-bold tracking-widest bg-amber-500 text-white border-none h-4 px-1"
                                    >
                                        {categoryName}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tour.price)}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5">Starting From</span>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-zinc-300" />
                                        <span className="text-xs font-bold text-white">{tour.duration}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5">Total Duration</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Actions Overlay */}
                <motion.div
                    className="absolute top-4 right-4 flex gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isHovered || showActionsOnClick ? 1 : 0, y: isHovered || showActionsOnClick ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Link
                        href={`/admin/tours/${tour.id || tour._id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            size="icon"
                            className="bg-amber-600 text-white hover:bg-amber-700 w-9 h-9 rounded-none backdrop-blur-sm"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        size="icon"
                        className="bg-red-500 text-white hover:bg-red-600 w-9 h-9 rounded-none backdrop-blur-sm"
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
