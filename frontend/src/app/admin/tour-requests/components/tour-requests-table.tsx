"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { TourRequestCard } from "./tour-request-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { TourRequest } from "../types";

const filterParams: DataTableFilterParam[] = [
    { id: "status", type: "array" },
    { id: "email" },
];

interface TourRequestsTableProps {
    data: TourRequest[];
    pageCount: number;
    pagination: PaginationState;
}

export function TourRequestsTable({ data, pageCount, pagination }: TourRequestsTableProps) {
    return (
        <DataTableWithView
            storageKey="tour_requests_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            renderCard={(row, { isMobile }) => {
                const request = row.original;
                if (!request) return null;
                return <TourRequestCard request={request} isMobile={isMobile} />;
            }}
        />
    );
}
