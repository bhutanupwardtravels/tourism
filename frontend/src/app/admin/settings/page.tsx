"use client";

import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import {
    DataTable,
    DataTableFilterParam,
} from "@/components/admin/data-table/data-table";
import { SettingsDataTableToolbar } from "./components/data-table-toolbar";
import { CostCard } from "./components/cost-card";
import { listCosts } from "./actions";
import { Cost } from "./schema";

const filterParams: DataTableFilterParam[] = [
    { id: "title" },
    { id: "travelerCategory" },
    { id: "isIndianNational" },
];

interface SettingsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        title?: string;
        travelerCategory?: string;
        isIndianNational?: string;
    }>;
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
    const [view, setView] = useState<"list" | "grid">("list");
    const [costs, setCosts] = useState<Cost[]>([]);
    const [pageData, setPageData] = useState({
        pageCount: 0,
        pageIndex: 0,
        pageSize: 10,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initial view choice and persistence
    useEffect(() => {
        const stored = localStorage.getItem("settings_view_preference");
        if (stored === "list" || stored === "grid") {
            setView(stored);
        } else if (window.innerWidth < 768) {
            setView("grid");
        }

        const handleResize = () => {
            if (!localStorage.getItem("settings_view_preference")) {
                if (window.innerWidth < 768) {
                    setView("grid");
                } else {
                    setView("list");
                }
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleViewChange = (newView: "list" | "grid") => {
        setView(newView);
        localStorage.setItem("settings_view_preference", newView);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const params = await searchParams;
            const page = Number(params?.page) || 1;
            const pageSize = Number(params?.page_size) || 10;
            const title = params?.title || "";
            const travelerCategory = params?.travelerCategory || "";
            const isIndianNational = params?.isIndianNational || "";

            const paginatedData = await listCosts(page, pageSize, title, {
                travelerCategory,
                isIndianNational,
            });

            setCosts(paginatedData.items as Cost[]);
            setPageData({
                pageCount: paginatedData.total_pages,
                pageIndex: paginatedData.page - 1,
                pageSize: paginatedData.page_size,
            });
            setIsLoading(false);
        };

        fetchData();
    }, [searchParams]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Fee Settings
                </h2>
                <p className="text-sm text-neutral-500">
                    Manage global fee structures, international rates, and regional cost adjustments.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={costs}
                view={view}
                onViewChange={handleViewChange}
                isLoading={isLoading}
                filterParams={filterParams}
                toolbar={SettingsDataTableToolbar}
                emptyMessage="No settings found."
                gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                renderCard={(row, { isMobile }) => (
                    <CostCard cost={row.original} isMobile={isMobile} />
                )}
            />
        </div>
    );
}
