"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Destination } from "../schema";
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

export const columns: ColumnDef<Destination>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <ImageCell imageUrl={row.original.image} alt={row.original.name} />
    ),
  },
  {
    accessorKey: "name",
    header: "Destination",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-900 truncate max-w-[250px]" title={row.getValue("name")}>
            {row.getValue("name")}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono tracking-tight lowercase">
            {row.original.slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700 uppercase tracking-tight">{row.getValue("region")}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Regional Area</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700">{row.getValue("priority")}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Value</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isEntryPoint",
    header: "Entry Point",
    cell: ({ row }) => {
      const isEntryPoint = row.getValue("isEntryPoint") as boolean;
      return (
        <div className="flex items-center">
          {isEntryPoint ? (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-tight">Yes</span>
              <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Main Entry</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">No</span>
              <span className="text-[10px] text-zinc-200 uppercase font-medium tracking-tight">Standard</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      if (!date) return null;
      try {
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-700">
              {format(new Date(date), "MMM d, yyyy")}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Last Update</span>
          </div>
        );
      } catch (error) {
        return null;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
