"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { SettingsDataTableToolbar } from "./data-table-toolbar";
import { CostCard } from "./cost-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { Cost } from "../schema";

const filterParams: DataTableFilterParam[] = [
    { id: "title" },
    { id: "travelerCategory" },
    { id: "isIndianNational" },
];

interface SettingsTableProps {
    data: Cost[];
    pageCount: number;
    pagination: PaginationState;
}

export function SettingsTable({ data, pageCount, pagination }: SettingsTableProps) {
    return (
        <DataTableWithView
            storageKey="settings_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={SettingsDataTableToolbar}
            emptyMessage="No settings found."
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            renderCard={(row, { isMobile }) => (
                <CostCard cost={row.original} isMobile={isMobile} />
            )}
        />
    );
}
