"use client";

import { useState, useEffect } from "react";
// Button, Plus, Link removed as unused
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getTours } from "./actions";
import { Tour } from "./schema";

interface ToursPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        category?: string;
        title?: string;
    }>;
}

export default function ToursPage({
    searchParams,
}: ToursPageProps) {
    // Always default to 'list' on the server to avoid hydration mismatch
    const [view, setView] = useState<"list" | "grid">("list");
    const [tours, setTours] = useState<Tour[]>([]);
    const [pageData, setPageData] = useState({
        pageCount: 0,
        pageIndex: 0,
        pageSize: 10,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load initial view from localStorage and set up resize listener
    useEffect(() => {
        const stored = localStorage.getItem("tours_view_preference");
        if (stored === "list" || stored === "grid") {
            setView(stored);
        } else if (window.innerWidth < 768) {
            setView("grid");
        }

        const handleResize = () => {
            // Only auto-switch if no manual preference is stored
            if (!localStorage.getItem("tours_view_preference")) {
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

    // Save view preference when user manually changes it
    const handleViewChange = (newView: "list" | "grid") => {
        setView(newView);
        localStorage.setItem("tours_view_preference", newView);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const params = await searchParams;
            const page = Number(params.page) || 1;
            const pageSize = Number(params.page_size) || 10;
            const category = params.category ? params.category.split(",") : undefined;
            const title = params.title || undefined;

            const paginatedData = await getTours(page, pageSize, category, title);

            setTours(paginatedData.items);
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
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-black">
                        Expeditions & Tours
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Manage your curated travel journeys and luxury itineraries.
                    </p>
                </div>
            </div>
            <DataTable
                data={tours}
                columns={columns}
                pageCount={pageData.pageCount}
                pagination={{
                    pageIndex: pageData.pageIndex,
                    pageSize: pageData.pageSize,
                }}
                view={view}
                onViewChange={handleViewChange}
            />
        </div>
    );
}
