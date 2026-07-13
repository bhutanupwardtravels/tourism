"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { TourCard } from "./tour-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { Tour } from "../schema";

const filterParams: DataTableFilterParam[] = [
    { id: "category", type: "array" },
    { id: "status", type: "auto" },
    { id: "title" },
];

interface ToursTableProps {
    data: Tour[];
    pageCount: number;
    pagination: PaginationState;
}

export function ToursTable({ data, pageCount, pagination }: ToursTableProps) {
    return (
        <DataTableWithView
            storageKey="tours_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            renderCard={(row, { isMobile }) => {
                const tour = row.original;
                if (!tour || (!tour.slug && !tour.id)) return null;
                return <TourCard tour={tour} showActionsOnClick={isMobile} />;
            }}
        />
    );
}
