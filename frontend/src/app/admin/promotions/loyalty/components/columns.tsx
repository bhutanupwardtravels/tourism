"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LoyaltyTierRow } from "../schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<LoyaltyTierRow>[] = [
    {
        accessorKey: "minPriorTrips",
        header: "Threshold",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">
                    From {row.original.minPriorTrips}{" "}
                    {row.original.minPriorTrips === 1 ? "previous trip" : "previous trips"}
                </span>
                <span className="text-[10px] text-zinc-400 tracking-tight">
                    and every trip after, until a higher tier is met
                </span>
            </div>
        ),
    },
    {
        accessorKey: "percent",
        header: "Discount",
        cell: ({ row }) => (
            <span className="text-xs font-bold text-zinc-700">{row.original.percent}%</span>
        ),
    },
    {
        id: "effective",
        header: "Effective",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700">
                    {row.original.effectivePercent}%
                </span>
                {row.original.capped && (
                    <Badge
                        variant="outline"
                        className={cn(
                            "w-fit rounded-none uppercase text-[9px] font-bold tracking-widest px-2 py-0.5",
                            "bg-amber-100 text-amber-800 border-amber-200"
                        )}
                    >
                        Capped
                    </Badge>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
