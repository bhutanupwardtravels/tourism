"use client";

import { ArrowLeft, CheckCircle2, XCircle, Archive, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestStatus, TourRequest } from "../../types";
import { cn } from "@/lib/utils";

interface RequestHeaderProps {
    request: TourRequest;
    onStatusUpdate: (status: RequestStatus) => void;
    onDeleteClick: () => void;
}

export function RequestHeader({ request, onStatusUpdate, onDeleteClick }: RequestHeaderProps) {
    const statusConfig = {
        [RequestStatus.PENDING]: {
            label: "Pending",
            color: "bg-amber-100 text-amber-700 border-amber-200",
        },
        [RequestStatus.APPROVED]: {
            label: "Approved",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        [RequestStatus.REJECTED]: {
            label: "Rejected",
            color: "bg-rose-100 text-rose-700 border-rose-200",
        },
        [RequestStatus.ARCHIVED]: {
            label: "Archived",
            color: "bg-gray-100 text-gray-700 border-gray-200",
        },
    };

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-8">
            <div className="flex items-center gap-6">
                <Link href="/admin/tour-requests">
                    <Button variant="outline" size="icon" className="rounded-none shadow-sm border-gray-200">
                        <ArrowLeft className="w-4 h-4 text-black" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold tracking-tight text-black">
                            {request.firstName} {request.lastName}
                        </h1>
                        <Badge variant="outline" className={cn("uppercase text-[10px] font-bold tracking-widest px-3 py-1 rounded-none", statusConfig[request.status].color)}>
                            {request.status}
                        </Badge>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Requested By</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {request.status !== RequestStatus.APPROVED && (
                    <Button
                        onClick={() => onStatusUpdate(RequestStatus.APPROVED)}
                        className="bg-black text-white hover:bg-gray-800 rounded-none shadow-sm px-6"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                    </Button>
                )}
                {request.status !== RequestStatus.REJECTED && (
                    <Button
                        variant="outline"
                        onClick={() => onStatusUpdate(RequestStatus.REJECTED)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-none px-6"
                    >
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                )}
                {request.status !== RequestStatus.ARCHIVED && (
                    <Button
                        variant="outline"
                        onClick={() => onStatusUpdate(RequestStatus.ARCHIVED)}
                        className="text-gray-400 border-gray-200 rounded-none"
                    >
                        <Archive className="mr-2 h-4 w-4" /> Archive
                    </Button>
                )}
                <Button
                    variant="ghost"
                    onClick={onDeleteClick}
                    className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-none"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
