"use client";

import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getTourRequests } from "./actions";
import { TourRequest, RequestStatus } from "./types";

interface TourRequestsPageProps {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    status?: string;
    email?: string;
  }>;
}

export default function TourRequestsPage({
  searchParams,
}: TourRequestsPageProps) {
  // Always default to 'list' on the server to avoid hydration mismatch
  const [view, setView] = useState<"list" | "grid">("list");
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [pageData, setPageData] = useState({
    pageCount: 0,
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial view from localStorage and set up resize listener
  useEffect(() => {
    const stored = localStorage.getItem("tour_requests_view_preference");
    if (stored === "list" || stored === "grid") {
      setView(stored);
    } else if (window.innerWidth < 768) {
      setView("grid");
    }

    const handleResize = () => {
      // Only auto-switch if no manual preference is stored
      if (!localStorage.getItem("tour_requests_view_preference")) {
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
    localStorage.setItem("tour_requests_view_preference", newView);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = await searchParams;
      const page = Number(params.page) || 1;
      const pageSize = Number(params.page_size) || 10;
      const status = params.status ? (params.status.split(",") as RequestStatus[]) : undefined;
      const email = params.email || undefined;

      const paginatedData = await getTourRequests(page, pageSize, status, email);

      setRequests(paginatedData.items as TourRequest[]);
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
            Tour Requests
          </h2>
          <p className="text-black text-sm">
            Manage incoming traveler inquiries and luxury package requests.
          </p>
        </div>
      </div>
      <DataTable
        data={requests}
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
