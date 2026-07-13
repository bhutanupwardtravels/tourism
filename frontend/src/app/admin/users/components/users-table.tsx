"use client";

import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { UserCard } from "./user-card";
import { DataTableWithView } from "@/components/admin/data-table/data-table-with-view";
import { DataTableFilterParam } from "@/components/admin/data-table/data-table";
import { User } from "../schema";

const filterParams: DataTableFilterParam[] = [
    { id: "username", param: "search" },
];

interface UsersTableProps {
    data: User[];
    pageCount: number;
    pagination: PaginationState;
}

export function UsersTable({ data, pageCount, pagination }: UsersTableProps) {
    return (
        <DataTableWithView
            storageKey="users_view_preference"
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            filterParams={filterParams}
            toolbar={DataTableToolbar}
            emptyMessage="No administrative users found."
            renderCard={(row) => <UserCard user={row.original} />}
        />
    );
}
