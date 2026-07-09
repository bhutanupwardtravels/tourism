"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Experience } from "../schema";
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

export const columns: ColumnDef<Experience>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <ImageCell imageUrl={row.original.image} alt={row.original.title} />
    ),
  },
  {
    accessorKey: "title",
    header: "Experience",
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
          <span className="text-xs font-bold text-zinc-700">{category}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Experience Category</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string;
      if (!difficulty) return "-";

      const colors: Record<string, string> = {
        Easy: "bg-green-100 text-green-800 border-green-200",
        Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Challenging: "bg-red-100 text-red-800 border-red-200",
      };

      return (
        <div className="flex flex-col gap-1">
          <span className={`w-fit inline-flex items-center rounded-none px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${colors[difficulty] || "bg-gray-100 text-gray-800"}`}>
            {difficulty}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number | undefined;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700">{priority ?? "-"}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Value</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price");
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700">
            {price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price)) : "-"}
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Cost Ref</span>
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
