"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { HotelCard } from "./hotel-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { Hotel } from "../schema";

const filterParams: DataTableFilterParam[] = [{ id: "name" }];

interface HotelsTableProps {
    data: Hotel[];
    pageCount: number;
    pagination: PaginationState;
}

export function HotelsTable({ data, pageCount, pagination }: HotelsTableProps) {
    return (
        <DataTableWithView
            storageKey="hotels_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            renderCard={(row, { isMobile }) => (
                <HotelCard hotel={row.original} showActionsOnClick={isMobile} />
            )}
        />
    );
}
