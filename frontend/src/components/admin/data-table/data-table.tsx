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
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    Table as TanstackTable,
    useReactTable,
    VisibilityState,
    OnChangeFn,
    PaginationState,
} from "@tanstack/react-table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import {
    DataTableSkeletonRows,
    DataTableSkeletonCards,
} from "./data-table-skeleton";

export interface DataTableFilterParam {
    /** Column id the filter binds to */
    id: string;
    /** URL query param name; defaults to the column id */
    param?: string;
    /**
     * How the filter value round-trips through the URL:
     * - "string": plain text value (default)
     * - "array":  comma-separated list <-> string[]
     * - "single": string[] in the table, but only the first entry is written to the URL
     * - "auto":   string[] when the URL value contains a comma, plain string otherwise
     */
    type?: "string" | "array" | "single" | "auto";
}

interface DataTableToolbarProps<TData> {
    table: TanstackTable<TData>;
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** Server-side pagination. Omit both to render every row without a pagination footer. */
    pageCount?: number;
    pagination?: PaginationState;
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
    isLoading?: boolean;
    /** URL query params kept in sync with the table's column filters */
    filterParams?: DataTableFilterParam[];
    toolbar?: React.ComponentType<DataTableToolbarProps<TData>>;
    /** Card renderer for grid view; the wrapping key is handled by the table */
    renderCard?: (row: Row<TData>, ctx: { isMobile: boolean }) => React.ReactNode;
    gridClassName?: string;
    emptyMessage?: string;
}

function filtersFromSearchParams(
    searchParams: ReadonlyURLSearchParams,
    filterParams: DataTableFilterParam[]
): ColumnFiltersState {
    const filters: ColumnFiltersState = [];
    for (const fp of filterParams) {
        const raw = searchParams.get(fp.param ?? fp.id);
        if (!raw) continue;
        switch (fp.type) {
            case "array":
                filters.push({ id: fp.id, value: raw.split(",") });
                break;
            case "single":
                filters.push({ id: fp.id, value: [raw] });
                break;
            case "auto":
                filters.push({
                    id: fp.id,
                    value: raw.includes(",") ? raw.split(",") : raw,
                });
                break;
            default:
                filters.push({ id: fp.id, value: raw });
        }
    }
    return filters;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    view = "list",
    onViewChange,
    isLoading = false,
    filterParams = [],
    toolbar: Toolbar,
    renderCard,
    gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const serverPaginated = pageCount !== undefined && pagination !== undefined;

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Initialize column filters from searchParams
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        () => filtersFromSearchParams(searchParams, filterParams)
    );

    // Sync column filters when searchParams change (e.g. back navigation)
    React.useEffect(() => {
        setColumnFilters(filtersFromSearchParams(searchParams, filterParams));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Determine if mobile (show actions on click/tap)
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Maintain pagination state locally
    const [paginationState, setPaginationState] = React.useState<PaginationState>(
        pagination ?? { pageIndex: 0, pageSize: 10 }
    );

    // Sync pagination state when props change
    React.useEffect(() => {
        if (pagination) {
            setPaginationState(pagination);
        }
    }, [pagination]);

    // Handle pagination changes
    const onPaginationChange: OnChangeFn<PaginationState> = React.useCallback(
        (updaterOrValue) => {
            const newPagination =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(paginationState)
                    : updaterOrValue;

            // Update local state immediately for responsive UI
            setPaginationState(newPagination);

            const params = new URLSearchParams(searchParams.toString());
            params.set("page", (newPagination.pageIndex + 1).toString());
            params.set("page_size", newPagination.pageSize.toString());

            router.push(`${pathname}?${params.toString()}`);
        },
        [paginationState, pathname, searchParams, router]
    );

    // Handle filter changes: write them back to the URL for server-side filtering
    const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = React.useCallback(
        (updaterOrValue) => {
            const newFilters =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(columnFilters)
                    : updaterOrValue;

            setColumnFilters(newFilters);

            const params = new URLSearchParams(searchParams.toString());

            filterParams.forEach((fp) => params.delete(fp.param ?? fp.id));

            newFilters.forEach((filter) => {
                const fp = filterParams.find((f) => f.id === filter.id);
                if (!fp) return;
                const key = fp.param ?? fp.id;
                const value = filter.value;
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        params.set(
                            key,
                            fp.type === "single" ? String(value[0]) : value.join(",")
                        );
                    }
                } else if (value) {
                    params.set(key, String(value));
                }
            });

            // Reset to page 1 when filtering
            if (serverPaginated) {
                params.set("page", "1");
            }

            router.push(`${pathname}?${params.toString()}`);
        },
        [columnFilters, filterParams, serverPaginated, pathname, searchParams, router]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            ...(serverPaginated ? { pagination: paginationState } : {}),
        },
        ...(serverPaginated
            ? {
                pageCount,
                manualPagination: true,
                onPaginationChange,
                getPaginationRowModel: getPaginationRowModel(),
            }
            : {}),
        manualFiltering: true, // Filtering happens server-side via the URL params
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-4">
            {Toolbar && (
                <Toolbar table={table} view={view} onViewChange={onViewChange} />
            )}
            {view === "list" || !renderCard ? (
                <div className="rounded-none border bg-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="h-16 hover:bg-gray-100/20"
                                >
                                    {headerGroup.headers.map((header) => (
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
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <DataTableSkeletonRows columns={columns.length} />
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="h-12 border-b border-gray-100 last:border-0"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-3 text-black"
                                            >
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
                                        className="h-24 text-center text-black"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className={gridClassName}>
                    {isLoading ? (
                        <DataTableSkeletonCards />
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                {renderCard(row, { isMobile })}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-black py-12">
                            {emptyMessage}
                        </div>
                    )}
                </div>
            )}
            {serverPaginated && <DataTablePagination table={table} />}
        </div>
    );
}
