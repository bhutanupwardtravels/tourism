"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    OnChangeFn,
} from "@tanstack/react-table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SettingsDataTableToolbar } from "./data-table-toolbar";
import { Loader2 } from "lucide-react";
import { CostCard } from "./cost-card";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
    isLoading?: boolean;
}

export function SettingsDataTable<TData, TValue>({
    columns,
    data,
    view = "list",
    onViewChange,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Determine if mobile (show actions on click/tap)
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = React.useCallback(
        (updaterOrValue) => {
            const newFilters =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(columnFilters)
                    : updaterOrValue;

            setColumnFilters(newFilters);

            const params = new URLSearchParams(searchParams.toString());

            const filterIds = ["title", "travelerCategory", "isIndianNational"];
            filterIds.forEach(id => {
                const filter = newFilters.find(f => f.id === id);
                if (filter?.value) {
                    params.set(id, String(filter.value));
                } else {
                    params.delete(id);
                }
            });

            router.push(`${pathname}?${params.toString()}`);
        },
        [columnFilters, pathname, searchParams, router]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        manualPagination: false, // Disabled manual pagination
        manualFiltering: true,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-4">
            <SettingsDataTableToolbar table={table} view={view} onViewChange={onViewChange} />

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                </div>
            ) : view === "list" ? (
                <div className="rounded-none border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="h-16 hover:bg-gray-100/20 border-b border-gray-200"
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="px-4 text-black font-semibold"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="h-12 border-b border-gray-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-4 py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-zinc-400 italic text-sm"
                                    >
                                        No settings found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <CostCard key={row.id} cost={row.original as any} isMobile={isMobile} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-zinc-400 italic py-12 border border-dashed border-gray-200">
                            No settings found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
