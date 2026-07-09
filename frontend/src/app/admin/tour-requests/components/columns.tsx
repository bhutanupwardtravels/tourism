"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
// Button and DropdownMenu components removed as they are unused
import { format } from "date-fns";
import { RequestStatus, TourRequest } from "../types";
import { DataTableRowActions } from "./data-table-row-actions";

const formatDateSafe = (dateStr: string | any, formatStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatStr);
};

export const columns: ColumnDef<TourRequest>[] = [
    {
        accessorKey: "firstName",
        header: "Client",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">{row.original.firstName} {row.original.lastName}</span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        enableHiding: true,
        cell: ({ row }) => <span className="text-xs text-zinc-500">{row.original.email}</span>,
    },
    {
        accessorKey: "tourId",
        header: "Package / Interest",
        cell: ({ row }) => (
            <div className="max-w-[200px]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">
                    {row.original.tourId ? "Package" : "Interest"}
                </div>
                <div className="text-xs font-semibold text-zinc-800 truncate uppercase tracking-tight">
                    {row.original.tourName || row.original.destination || "Custom Luxe Experience"}
                </div>
            </div>
        )
    },
    {
        accessorKey: "travelDate",
        header: "Travel Date",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-700">
                    {formatDateSafe(row.original.travelDate, "MMM d, yyyy")}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Proposed Date</span>
            </div>
        )
    },
    {
        accessorKey: "travelers",
        header: "Travelers",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-700">{row.original.travelers} Persons</span>
                <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Group Size</span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    className={`
            ${status === RequestStatus.APPROVED ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
            ${status === RequestStatus.PENDING ? "bg-amber-100 text-amber-700 border-amber-200" : ""}
            ${status === RequestStatus.REJECTED ? "bg-rose-100 text-rose-700 border-rose-200" : ""}
            ${status === RequestStatus.ARCHIVED ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
            rounded-none uppercase text-[10px] font-bold tracking-widest
          `}
                    variant="outline"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Received",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">
                        {formatDateSafe(row.original.createdAt, "PP")}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Request Date</span>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
