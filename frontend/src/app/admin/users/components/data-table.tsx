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
import { UserCard } from "./user-card";
import { Loader2 } from "lucide-react";

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
  isLoading?: boolean;
}

export function UsersDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
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

  const [paginationState, setPaginationState] =
    React.useState<PaginationState>(pagination);

  React.useEffect(() => {
    setPaginationState(pagination);
  }, [pagination]);

  // Determine if mobile (show actions on click/tap)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onPaginationChange: OnChangeFn<PaginationState> = React.useCallback(
    (updaterOrValue) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(paginationState)
          : updaterOrValue;

      setPaginationState(newPagination);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (newPagination.pageIndex + 1).toString());
      params.set("page_size", newPagination.pageSize.toString());

      router.push(`${pathname}?${params.toString()}`);
    },
    [paginationState, pathname, searchParams, router]
  );

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = React.useCallback(
    (updaterOrValue) => {
      const newFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      setColumnFilters(newFilters);

      const searchFilter = newFilters.find(f => f.id === "username")?.value as string;

      const params = new URLSearchParams(searchParams.toString());
      if (searchFilter) {
        params.set("search", searchFilter);
      } else {
        params.delete("search");
      }
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
    manualFiltering: true,
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

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
        </div>
      ) : view === "list" ? (
        <div className="rounded-none border bg-card overflow-hidden">
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
                    className="h-12 border-b border-gray-100 last:border-0"
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
                    No administrative users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <UserCard key={row.id} user={row.original as any} />
            ))
          ) : (
            <div className="col-span-full text-center text-black py-12">
              No administrative users found.
            </div>
          )}
        </div>
      )}

      <DataTablePagination table={table} />
    </div>
  );
}
