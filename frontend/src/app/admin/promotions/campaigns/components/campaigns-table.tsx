"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { CampaignsDataTableToolbar } from "./data-table-toolbar";
import { DataTable, DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { PromoCampaign } from "../schema";

const filterParams: DataTableFilterParam[] = [{ id: "name" }, { id: "isActive", type: "single" }];

interface CampaignsTableProps {
    data: PromoCampaign[];
    pageCount: number;
    pagination: PaginationState;
}

export function CampaignsTable({ data, pageCount, pagination }: CampaignsTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={CampaignsDataTableToolbar}
            emptyMessage="No campaigns yet."
        />
    );
}
