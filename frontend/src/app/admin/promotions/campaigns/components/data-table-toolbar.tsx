"use client";

import { Table } from "@tanstack/react-table";
import { X, Search, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/admin/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/admin/data-table/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function CampaignsDataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search campaigns..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                        className="h-9 pl-9 text-black border-gray-200 bg-white focus-visible:ring-amber-500"
                    />
                </div>

                {table.getColumn("isActive") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("isActive")}
                        title="Status"
                        options={[
                            { label: "Active", value: "true" },
                            { label: "Paused", value: "false" },
                        ]}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-9 text-black hover:bg-gray-100 rounded-none text-xs"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <DataTableViewOptions table={table} />
                <Link href="/admin/promotions/campaigns/create">
                    <Button
                        size="sm"
                        className="h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest px-4"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>
        </div>
    );
}
