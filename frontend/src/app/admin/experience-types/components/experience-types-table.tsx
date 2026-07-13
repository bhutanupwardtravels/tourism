"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { ExperienceTypeCard } from "./experience-type-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { ExperienceType } from "../schema";

const filterParams: DataTableFilterParam[] = [{ id: "title", type: "auto" }];

interface ExperienceTypesTableProps {
    data: ExperienceType[];
    pageCount: number;
    pagination: PaginationState;
}

export function ExperienceTypesTable({ data, pageCount, pagination }: ExperienceTypesTableProps) {
    return (
        <DataTableWithView
            storageKey="experience_types_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            renderCard={(row) => (
                <ExperienceTypeCard experienceType={row.original} />
            )}
        />
    );
}
