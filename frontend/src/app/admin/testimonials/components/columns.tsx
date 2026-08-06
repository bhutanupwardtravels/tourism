"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { Testimonial } from "../schema";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";

function AvatarCell({ imageUrl, name }: { imageUrl?: string; name: string }) {
    if (!imageUrl) {
        return (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-zinc-500">
                {name.charAt(0).toUpperCase()}
            </div>
        );
    }
    return (
        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
            <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </div>
    );
}

export const columns: ColumnDef<Testimonial>[] = [
    {
        accessorKey: "avatar",
        header: "Photo",
        cell: ({ row }) => <AvatarCell imageUrl={row.original.avatar} name={row.original.name} />,
    },
    {
        accessorKey: "name",
        header: "Traveler",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-zinc-900 truncate max-w-[200px]" title={row.getValue("name")}>
                    {row.getValue("name")}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">
                    {row.original.role || "Traveler"}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "quote",
        header: "Testimonial",
        cell: ({ row }) => (
            <p className="text-xs text-zinc-600 max-w-[320px] truncate" title={row.getValue("quote")}>
                {row.getValue("quote")}
            </p>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.getValue("rating") as number;
            return (
                <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-zinc-700">{rating}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "isFeatured",
        header: "Status",
        cell: ({ row }) => {
            const isFeatured = row.getValue("isFeatured") as boolean;
            return (
                <Badge
                    className={
                        isFeatured
                            ? "rounded-none bg-emerald-100 text-emerald-700 border-none"
                            : "rounded-none bg-gray-100 text-gray-500 border-none"
                    }
                >
                    {isFeatured ? "On Website" : "Hidden"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as number | undefined;
            return <span className="text-xs font-bold text-zinc-700">{priority ?? "-"}</span>;
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => {
            const date = row.getValue("updatedAt") as string;
            if (!date) return null;
            try {
                return <span className="text-xs font-bold text-zinc-700">{format(new Date(date), "MMM d, yyyy")}</span>;
            } catch {
                return null;
            }
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
