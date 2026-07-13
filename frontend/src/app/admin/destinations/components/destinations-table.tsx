"use client";

import { ComponentProps } from "react";
import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { DestinationCard } from "./destination-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { Destination } from "../schema";

const filterParams: DataTableFilterParam[] = [
    { id: "name" },
    { id: "region", type: "array" },
    { id: "isEntryPoint", type: "single" },
];

interface DestinationsTableProps {
    data: Destination[];
    pageCount: number;
    pagination: PaginationState;
}

export function DestinationsTable({ data, pageCount, pagination }: DestinationsTableProps) {
    return (
        <DataTableWithView
            storageKey="destinations_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            renderCard={(row, { isMobile }) => {
                const destination = row.original;
                if (!destination || typeof destination.slug !== "string") return null;
                return (
                    <DestinationCard
                        destination={destination as ComponentProps<typeof DestinationCard>["destination"]}
                        showActionsOnClick={isMobile}
                    />
                );
            }}
        />
    );
}
