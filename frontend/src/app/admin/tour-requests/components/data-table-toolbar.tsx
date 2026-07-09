"use client";

import { Table } from "@tanstack/react-table";
import { X, CheckCircle, Circle, Archive, Ban, List, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RequestStatus } from "../types";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
}

export function DataTableToolbar<TData>({
    table,
    view,
    onViewChange,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const statusOptions = [
        { label: "Pending", value: RequestStatus.PENDING, icon: Circle },
        { label: "Approved", value: RequestStatus.APPROVED, icon: CheckCircle },
        { label: "Rejected", value: RequestStatus.REJECTED, icon: Ban },
        { label: "Archived", value: RequestStatus.ARCHIVED, icon: Archive },
    ];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="h-9 w-[150px] lg:w-[350px] text-black font-medium"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statusOptions}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                        className="h-9 px-2 lg:px-3 text-black"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />
                {view && onViewChange && (
                    <div className="flex items-center gap-1 border rounded-none p-1 bg-white shadow-xs">
                        <Button
                            variant={view === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewChange("list")}
                            className={`h-7 w-7 p-0 rounded-none transition-all ${view === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewChange("grid")}
                            className={`h-7 w-7 p-0 rounded-none transition-all ${view === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
