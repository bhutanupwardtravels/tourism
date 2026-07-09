"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import { getExperienceTypes } from "./actions";
import { columns } from "./components/columns";
import { ExperienceType } from "./schema";

interface ExperienceTypesPageProps {
  searchParams: Promise<{ page?: string; page_size?: string; title?: string }>;
}

export default function ExperienceTypesPage({ searchParams }: ExperienceTypesPageProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [experienceTypes, setExperienceTypes] = useState<ExperienceType[]>([]);
  const [pageData, setPageData] = useState({
    pageCount: 0,
    pageIndex: 0,
    pageSize: 6,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial view from localStorage and set up resize listener
  useEffect(() => {
    const stored = localStorage.getItem("experience_types_view_preference");
    if (stored === "list" || stored === "grid") {
      setView(stored);
    } else if (window.innerWidth < 768) {
      setView("grid");
    }

    const handleResize = () => {
      // Only auto-switch if no manual preference is stored
      if (!localStorage.getItem("experience_types_view_preference")) {
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
    localStorage.setItem("experience_types_view_preference", newView);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = await searchParams;
      const page = Number(params.page) || 1;
      const pageSize = Number(params.page_size) || 6;
      const title = params.title || undefined;

      const paginatedData = await getExperienceTypes(page, pageSize, title);

      setExperienceTypes(paginatedData.items);
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
          Experience Types
        </h2>
        <p className="text-black text-sm">
          Manage experience categories and their featured content.
        </p>
      </div>
      <DataTable
        data={experienceTypes}
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
