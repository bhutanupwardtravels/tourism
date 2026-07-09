"use client";

import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { UsersDataTable } from "./components/data-table";
import { listUsers } from "./actions";
import { User } from "./schema";

interface UsersPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        search?: string;
    }>;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
    const [view, setView] = useState<"list" | "grid">("list");
    const [users, setUsers] = useState<User[]>([]);
    const [pageData, setPageData] = useState({
        pageCount: 0,
        pageIndex: 0,
        pageSize: 10,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initial view choice and persistence
    useEffect(() => {
        const stored = localStorage.getItem("users_view_preference");
        if (stored === "list" || stored === "grid") {
            setView(stored);
        } else if (window.innerWidth < 768) {
            setView("grid");
        }

        const handleResize = () => {
            if (!localStorage.getItem("users_view_preference")) {
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
        localStorage.setItem("users_view_preference", newView);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const params = await searchParams;
            const page = Number(params.page) || 1;
            const pageSize = Number(params.page_size) || 10;
            const search = params.search || undefined;

            const paginatedData = await listUsers(page, pageSize, search);

            setUsers(paginatedData.items as User[]);
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
                    User Management
                </h2>
                <p className="text-sm text-neutral-500">
                    Manage system administrators and staff access levels.
                </p>
            </div>

            <UsersDataTable
                columns={columns}
                data={users}
                pageCount={pageData.pageCount}
                pagination={{
                    pageIndex: pageData.pageIndex,
                    pageSize: pageData.pageSize,
                }}
                view={view}
                onViewChange={handleViewChange}
                isLoading={isLoading}
            />
        </div>
    );
}
