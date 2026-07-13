"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { ExperienceCard } from "./experience-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { Experience } from "../schema";

const filterParams: DataTableFilterParam[] = [
    { id: "title" },
    { id: "category", type: "array" },
];

interface ExperiencesTableProps {
    data: Experience[];
    pageCount: number;
    pagination: PaginationState;
}

export function ExperiencesTable({ data, pageCount, pagination }: ExperiencesTableProps) {
    return (
        <DataTableWithView
            storageKey="experiences_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            renderCard={(row, { isMobile }) => (
                <ExperienceCard experience={row.original} showActionsOnClick={isMobile} />
            )}
        />
    );
}
