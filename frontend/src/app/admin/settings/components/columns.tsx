"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cost } from "../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Cost>[] = [
    {
        accessorKey: "title",
        header: "Cost Setting",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 truncate max-w-[250px]" title={row.getValue("title")}>
                        {row.getValue("title")}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-tight lowercase">
                        {row.original.description ? (row.original.description.length > 50 ? row.original.description.substring(0, 50) + "..." : row.original.description) : "Global fee setting"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">USD Rate</span>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Charge Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string || "fixed";
            const isFixed = type === "fixed";

            return (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={cn(
                        "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5",
                        isFixed
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                    )}>
                        {type}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "travelerCategory",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("travelerCategory") as string || "adult";
            const labelMap: Record<string, string> = {
                adult: "Adult",
                child_6_12: "Child (6-12)",
                child_under_6: "Child < 6",
            };
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">{labelMap[category]}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "isIndianNational",
        header: "Nationality",
        cell: ({ row }) => {
            const isIndian = row.getValue("isIndianNational") as boolean;
            return (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={cn(
                        "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5",
                        isIndian
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-purple-100 text-purple-800 border-purple-200"
                    )}>
                        {isIndian ? "Indian National" : "International"}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
