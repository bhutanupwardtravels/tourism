"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cost } from "../schema";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Globe, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DeleteCostDialog } from "./delete-cost-dialog";
import { format } from "date-fns";

interface CostCardProps {
    cost: Cost;
    isMobile?: boolean; // Added to match interface consistency
}

export function CostCard({ cost, isMobile }: CostCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const isIndian = cost.isIndianNational;
    const isFixed = cost.type === "fixed";
    const costId = cost.id || cost._id || "";

    return (
        <>
            <DeleteCostDialog
                cost={cost}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <motion.div
                className="relative overflow-hidden bg-white border border-gray-100 group cursor-pointer hover:shadow-xl transition-all duration-500 rounded-none h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => router.push(`/admin/settings/${costId}/edit`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-8 space-y-6 flex-1">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-semibold text-black tracking-tight leading-tight truncate">
                                {cost.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span className="text-sm font-bold text-zinc-900">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(cost.price || 0)}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-none uppercase text-[9px] font-black tracking-widest px-1.5 py-0",
                                    isFixed
                                        ? "bg-amber-100/80 text-amber-800 border-amber-200"
                                        : "bg-zinc-100/80 text-zinc-800 border-zinc-200"
                                )}
                            >
                                {isFixed ? "One-time" : "Daily"}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1.5">
                            Cost Details
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Category</div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-black">
                                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="capitalize truncate">{cost.travelerCategory?.replace(/_/g, " ")}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Origin</div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-black">
                                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="truncate">{isIndian ? "Indian National" : "International"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Date */}
                    <div className="text-[10px] text-zinc-500 pt-5 flex justify-between items-center -mx-8 -mb-8 px-8 py-5 border-t border-gray-100 mt-auto">
                        <span className="uppercase tracking-widest font-bold text-zinc-500">Created</span>
                        <span className="font-bold text-zinc-800">
                            {cost.createdAt ? format(new Date(cost.createdAt), "PP") : "N/A"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <motion.div
                    className="absolute top-6 right-6 flex gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isHovered || isMobile ? 1 : 0, x: isHovered || isMobile ? 0 : 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <Button
                        size="icon"
                        className="bg-amber-500 text-white hover:bg-amber-600 w-10 h-10 rounded-none shadow-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/settings/${costId}/edit`);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        className="bg-red-600 text-white hover:bg-red-700 w-10 h-10 rounded-none shadow-xl border-none"
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
