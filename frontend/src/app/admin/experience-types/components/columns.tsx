"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExperienceType } from "../schema";
import { DataTableRowActions } from "./data-table-row-actions";

function ImageCell({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
    if (!imageUrl) {
        return <div className="h-10 w-16 rounded bg-muted" />;
    }
    return (
        <div className="h-10 w-16 overflow-hidden rounded-none bg-muted">
            <img
                src={imageUrl}
                alt={alt}
                className="h-full w-full object-cover"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </div>
    );
}

export const columns: ColumnDef<ExperienceType>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            <ImageCell imageUrl={row.original.image} alt={row.original.title} />
        ),
    },
    {
        accessorKey: "title",
        header: "Category",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 truncate max-w-[250px]" title={row.getValue("title")}>
                        {row.getValue("title")}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-tight lowercase">
                        {row.original.slug}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "displayOrder",
        header: "Priority",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">
                        {row.getValue("displayOrder")}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Value</span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = row.getValue("createdAt");
            if (!date) return "-";
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">
                        {format(new Date(date as string), "MMM d, yyyy")}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Listing Date</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
