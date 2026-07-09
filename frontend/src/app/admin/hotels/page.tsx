"use client";

import { useState, useEffect } from "react";
// Link and Button removed as unused
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getHotels } from "./actions";
import { Hotel } from "./schema";

export default function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; page_size?: string; name?: string }>;
}) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pageData, setPageData] = useState({
    pageCount: 0,
    pageIndex: 0,
    pageSize: 6,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial view from localStorage and set up resize listener
  useEffect(() => {
    const stored = localStorage.getItem("hotels_view_preference");
    if (stored === "list" || stored === "grid") {
      setView(stored);
    } else if (window.innerWidth < 768) {
      setView("grid");
    }

    const handleResize = () => {
      // Only auto-switch if no manual preference is stored
      if (!localStorage.getItem("hotels_view_preference")) {
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
    localStorage.setItem("hotels_view_preference", newView);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = await searchParams;
      const page = Number(params.page) || 1;
      const pageSize = Number(params.page_size) || 6;
      const name = params.name || undefined;

      const paginatedData = await getHotels(page, pageSize, name);

      setHotels(paginatedData.items);
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
      <div>
        <h1 className="text-2xl font-semibold text-black">Hotels</h1>
        <p className="text-sm text-black mt-1">
          Manage hotels and accommodations
        </p>
      </div>

      <DataTable
        data={hotels}
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
