"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Tour } from "../schema";
import { DataTableColumnHeader } from "@/components/admin/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getExperienceTypeById } from "@/app/admin/experience-types/actions";

function ImageCell({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
    if (!imageUrl) {
        return <div className="h-10 w-16 rounded bg-muted" />;
    }
    return (
        <div className="h-10 w-16 overflow-hidden rounded-none bg-muted border border-gray-100 shadow-sm">
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

function CategoryCell({ categoryId }: { categoryId?: string }) {
    const [categoryName, setCategoryName] = useState<string>("Loading...");

    useEffect(() => {
        if (!categoryId) {
            setCategoryName("-");
            return;
        }

        const fetchCategory = async () => {
            try {
                const experienceType = await getExperienceTypeById(categoryId);
                setCategoryName(experienceType?.title || categoryId);
            } catch (error) {
                setCategoryName(categoryId);
            }
        };

        fetchCategory();
    }, [categoryId]);

    if (!categoryName || categoryName === "-") return <span className="text-gray-400">-</span>;

    return (
        <Badge
            variant="outline"
            className="rounded-none uppercase text-[10px] font-bold tracking-widest bg-amber-50 text-amber-700 border-amber-200"
        >
            {categoryName}
        </Badge>
    );
}

export const columns: ColumnDef<Tour>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            <ImageCell imageUrl={row.original.image} alt={row.original.title} />
        ),
    },
    {
        accessorKey: "title",
        header: "Expedition / Tour",
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
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category") as string;
            return (
                <div className="flex flex-col">
                    <CategoryCell categoryId={category} />
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price") as string);
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(isNaN(amount) ? 0 : amount);
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">{formatted}</span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Starting From</span>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as number;
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700">{priority ?? 0}</span>
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
