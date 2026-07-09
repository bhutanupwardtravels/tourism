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
  SortingState,
  useReactTable,
  VisibilityState,
  OnChangeFn,
  PaginationState,
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
import { DataTablePagination } from "@/components/admin/data-table/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DestinationCard } from "@/app/admin/destinations/components/destination-card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  view?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  view,
  onViewChange,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Initialize column filters from searchParams
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    const name = searchParams.get("name");
    const region = searchParams.get("region");
    const isEntryPoint = searchParams.get("isEntryPoint");
    if (name) {
      filters.push({ id: "name", value: name });
    }
    if (region) {
      filters.push({ id: "region", value: region.split(",") });
    }
    if (isEntryPoint) {
      filters.push({ id: "isEntryPoint", value: [isEntryPoint] });
    }
    return filters;
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Sync column filters when searchParams change (e.g. back navigation)
  React.useEffect(() => {
    const filters: ColumnFiltersState = [];
    const name = searchParams.get("name");
    const region = searchParams.get("region");
    const isEntryPoint = searchParams.get("isEntryPoint");
    if (name) {
      filters.push({ id: "name", value: name });
    }
    if (region) {
      filters.push({ id: "region", value: region.split(",") });
    }
    if (isEntryPoint) {
      filters.push({ id: "isEntryPoint", value: [isEntryPoint] });
    }
    setColumnFilters(filters);
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
  const [paginationState, setPaginationState] =
    React.useState<PaginationState>(pagination);

  // Sync pagination state when props change
  React.useEffect(() => {
    setPaginationState(pagination);
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

  // Handle filter changes
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = React.useCallback(
    (updaterOrValue) => {
      const newFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      setColumnFilters(newFilters);

      const params = new URLSearchParams(searchParams.toString());

      // Clear existing filters from params first
      params.delete("name");
      params.delete("region");
      params.delete("isEntryPoint");

      newFilters.forEach(filter => {
        if (filter.id === "name") {
          if (filter.value) {
            params.set(filter.id, filter.value as string);
          }
        } else if (filter.id === "region") {
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            params.set(filter.id, filter.value.join(","));
          }
        } else if (filter.id === "isEntryPoint") {
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            params.set(filter.id, filter.value[0]);
          }
        }
      });

      // Reset to page 1 when filtering
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    },
    [columnFilters, pathname, searchParams, router]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: paginationState,
    },
    manualPagination: true,
    manualFiltering: true, // Tell table we handle filtering on server
    onPaginationChange: onPaginationChange,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} view={view} onViewChange={onViewChange} />
      {view === "list" ? (
        <div className="rounded-none border bg-card">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="h-16 hover:bg-gray-100/20"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="px-4"
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
                    className="h-12"
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
                    className="h-24 text-center text-black"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const destination = row.original as any;
              if (!destination || typeof destination.slug !== "string") return null;

              return (
                <DestinationCard
                  key={destination.slug}
                  destination={destination}
                  showActionsOnClick={isMobile}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center text-black py-12">
              No results.
            </div>
          )}
        </div>
      )}
      <DataTablePagination table={table} />
    </div>
  );
}
