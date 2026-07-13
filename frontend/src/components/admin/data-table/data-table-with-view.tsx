"use client";

import * as React from "react";
import { ColumnDef, Row, PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableFilterParam } from "./data-table";

interface DataTableToolbarProps<TData> {
    table: import("@tanstack/react-table").Table<TData>;
    view?: "list" | "grid";
    onViewChange?: (view: "list" | "grid") => void;
}

interface DataTableWithViewProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    pagination?: PaginationState;
    filterParams?: DataTableFilterParam[];
    toolbar?: React.ComponentType<DataTableToolbarProps<TData>>;
    renderCard?: (row: Row<TData>, ctx: { isMobile: boolean }) => React.ReactNode;
    gridClassName?: string;
    emptyMessage?: string;
    /** localStorage key for persisting the user's list/grid preference */
    storageKey: string;
}

export function DataTableWithView<TData, TValue>({
    storageKey,
    ...tableProps
}: DataTableWithViewProps<TData, TValue>) {
    const [view, setView] = React.useState<"list" | "grid">("list");

    React.useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored === "list" || stored === "grid") {
            setView(stored);
        } else if (window.innerWidth < 768) {
            setView("grid");
        }

        const handleResize = () => {
            if (!localStorage.getItem(storageKey)) {
                setView(window.innerWidth < 768 ? "grid" : "list");
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [storageKey]);

    const handleViewChange = (newView: "list" | "grid") => {
        setView(newView);
        localStorage.setItem(storageKey, newView);
    };

    return (
        <DataTable
            {...tableProps}
            view={view}
            onViewChange={handleViewChange}
        />
    );
}
