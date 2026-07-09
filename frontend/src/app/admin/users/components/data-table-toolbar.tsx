"use client";

import { Table } from "@tanstack/react-table";
import { X, Search, Plus, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DataTableViewOptions } from "@/components/admin/data-table/data-table-view-options";

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

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-[150px] lg:w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("username")?.setFilterValue(event.target.value)
                        }
                        className="h-9 pl-9 text-black font-medium"
                    />
                </div>
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
                <Link href="/admin/users/create">
                    <Button size="sm" className="h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-bold text-xs uppercase tracking-widest px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create User
                    </Button>
                </Link>


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
