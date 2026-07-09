"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Calendar, Users, Eye, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TourRequest, RequestStatus } from "../types";
import { format, isValid } from "date-fns";

const formatDate = (dateStr: string | any, formatStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (!isValid(date)) return "N/A";
    return format(date, formatStr);
};

import { DeleteTourRequestDialog } from "./delete-tour-request-dialog";

interface TourRequestCardProps {
    request: TourRequest;
    isMobile?: boolean;
}

const statusConfig = {
    [RequestStatus.PENDING]: {
        label: "Pending",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <Badge variant="outline" className="bg-amber-100/80 text-amber-800 border-amber-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Pending</Badge>
    },
    [RequestStatus.APPROVED]: {
        label: "Approved",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <Badge variant="outline" className="bg-emerald-100/80 text-emerald-800 border-emerald-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Approved</Badge>
    },
    [RequestStatus.REJECTED]: {
        label: "Rejected",
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: <Badge variant="outline" className="bg-rose-100/80 text-rose-800 border-rose-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Rejected</Badge>
    },
    [RequestStatus.ARCHIVED]: {
        label: "Archived",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <Badge variant="outline" className="bg-gray-100/80 text-gray-800 border-gray-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Archived</Badge>
    },
};

export function TourRequestCard({ request, isMobile }: TourRequestCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const fullName = `${request.firstName} ${request.lastName}`;

    return (
        <>
            <DeleteTourRequestDialog
                request={request}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <motion.div
                className="relative overflow-hidden bg-white border border-gray-100 group cursor-pointer hover:shadow-xl transition-all duration-500 rounded-none h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => router.push(`/admin/tour-requests/${request._id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-8 space-y-6 flex-1">
                    {/* Header: Name and Status */}
                    <div className="flex flex-col gap-2">
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-semibold text-black tracking-tight leading-tight">
                                {fullName}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[180px]">{request.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            {statusConfig[request.status].icon}
                        </div>
                    </div>

                    {/* Destination / Tour Name */}
                    <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1.5">
                            Interest
                        </div>
                        <p className="text-sm font-medium text-black uppercase tracking-tight line-clamp-2 leading-snug">
                            {request.tourName || request.destination || "Custom Luxe Experience"}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Travel Date</div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                <span>{formatDate(request.travelDate, "MMM d, yyyy")}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Travelers</div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <Users className="w-4 h-4 text-zinc-400" />
                                <span>{request.travelers} Persons</span>
                            </div>
                        </div>
                    </div>



                    {/* Date Created */}
                    <div className="text-[10px] text-zinc-500 pt-5 flex justify-between items-center -mx-8 -mb-8 px-8 py-5 border-t border-gray-100 mt-auto">
                        <span className="uppercase tracking-widest font-bold text-zinc-500">Received</span>
                        <span className="font-bold text-zinc-800">{formatDate(request.createdAt, "PP")}</span>
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
                            router.push(`/admin/tour-requests/${request._id}`);
                        }}
                    >
                        <Eye className="w-4 h-4" />
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
