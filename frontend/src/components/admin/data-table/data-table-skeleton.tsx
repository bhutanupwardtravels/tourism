"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

// Cycle of widths so skeleton rows read like real content instead of uniform bars
const CELL_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-3/5"];

interface DataTableSkeletonRowsProps {
    columns: number;
    rows?: number;
}

export function DataTableSkeletonRows({
    columns,
    rows = 8,
}: DataTableSkeletonRowsProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="h-12 hover:bg-transparent">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <TableCell key={colIndex} className="px-4 py-3">
                            <Skeleton
                                className={`h-4 bg-gray-200 ${CELL_WIDTHS[(rowIndex + colIndex) % CELL_WIDTHS.length]}`}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

interface DataTableSkeletonCardsProps {
    cards?: number;
}

export function DataTableSkeletonCards({ cards = 6 }: DataTableSkeletonCardsProps) {
    return (
        <>
            {Array.from({ length: cards }).map((_, index) => (
                <div key={index} className="rounded-none border bg-card overflow-hidden">
                    <Skeleton className="aspect-video w-full rounded-none bg-gray-200" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-2/3 bg-gray-200" />
                        <Skeleton className="h-3 w-full bg-gray-200" />
                        <Skeleton className="h-3 w-1/2 bg-gray-200" />
                    </div>
                </div>
            ))}
        </>
    );
}
