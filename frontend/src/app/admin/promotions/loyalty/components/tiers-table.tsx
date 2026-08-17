"use client";

import { columns } from "./columns";
import { TiersDataTableToolbar } from "./data-table-toolbar";
import { DataTable, DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { LoyaltyTierRow } from "../schema";

const filterParams: DataTableFilterParam[] = [{ id: "minPriorTrips" }];

interface TiersTableProps {
    data: LoyaltyTierRow[];
}

export function TiersTable({ data }: TiersTableProps) {
    // Tiers live in one settings document and never run to more than a handful
    // of rows, so every row renders at once — no pagination footer.
    return (
        <DataTable
            data={data}
            columns={columns}
            filterParams={filterParams}
            toolbar={TiersDataTableToolbar}
            emptyMessage="No tiers yet. Add one to start rewarding repeat travellers."
        />
    );
}
