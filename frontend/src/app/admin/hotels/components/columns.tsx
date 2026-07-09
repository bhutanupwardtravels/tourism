"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Hotel } from "../schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { useEffect, useState } from "react";
import { getDestinationById } from "@/app/admin/destinations/actions";


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

function DestinationCell({ destinationId }: { destinationId?: string }) {
  const [destinationName, setDestinationName] = useState<string>("Loading...");

  useEffect(() => {
    if (!destinationId) {
      setDestinationName("-");
      return;
    }

    const fetchDestination = async () => {
      try {
        const destination = await getDestinationById(destinationId);
        setDestinationName(destination?.name || destinationId);
      } catch (error) {
        setDestinationName(destinationId);
      }
    };

    fetchDestination();
  }, [destinationId]);

  return (
    <div className="text-xs text-zinc-500">
      {destinationName}
    </div>
  );
}

export const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <ImageCell imageUrl={row.original.image} alt={row.original.name} />
    ),
  },
  {
    accessorKey: "name",
    header: "Hotel / Estate",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-900 truncate max-w-[250px]" title={row.getValue("name")}>
            {row.getValue("name")}
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">
            {row.original.location || "Undisclosed Location"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => {
      const destinationId = row.original.destination || row.original.destinationId || row.original.destinationSlug;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700">
            <DestinationCell destinationId={destinationId} />
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Market Location</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-xs font-bold text-zinc-700">{rating}</span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Star Rating</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priceRange",
    header: "Price Range",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700 uppercase">{row.getValue("priceRange")}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-tight">Price Tier</span>
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
