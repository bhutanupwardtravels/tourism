"use client";

import { useState, useEffect } from "react";
import {
  DataTable,
  DataTableFilterParam,
} from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { ExperienceCard } from "./components/experience-card";
import { getExperiences } from "./actions";
import { columns } from "./components/columns";
import { Experience } from "./schema";

const filterParams: DataTableFilterParam[] = [
  { id: "title" },
  { id: "category", type: "array" },
];

interface ExperiencesPageProps {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    title?: string;
    category?: string;
  }>;
}

export default function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [pageData, setPageData] = useState({
    pageCount: 0,
    pageIndex: 0,
    pageSize: 6,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial view from localStorage and set up resize listener
  useEffect(() => {
    const stored = localStorage.getItem("experiences_view_preference");
    if (stored === "list" || stored === "grid") {
      setView(stored);
    } else if (window.innerWidth < 768) {
      setView("grid");
    }

    const handleResize = () => {
      // Only auto-switch if no manual preference is stored
      if (!localStorage.getItem("experiences_view_preference")) {
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
    localStorage.setItem("experiences_view_preference", newView);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = await searchParams;
      const page = Number(params.page) || 1;
      const pageSize = Number(params.page_size) || (view === "grid" ? 6 : 10);
      const title = params.title || undefined;
      const category = params.category || undefined;

      const paginatedData = await getExperiences(page, pageSize, title, category);

      setExperiences(paginatedData.items);
      setPageData({
        pageCount: paginatedData.total_pages,
        pageIndex: paginatedData.page - 1,
        pageSize: paginatedData.page_size,
      });
      setIsLoading(false);
    };

    fetchData();
  }, [searchParams, view]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-black">
          Experiences
        </h2>
        <p className="text-black text-sm">
          Manage experiences and activities.
        </p>
      </div>
      <DataTable
        data={experiences}
        columns={columns}
        pageCount={pageData.pageCount}
        pagination={{
          pageIndex: pageData.pageIndex,
          pageSize: pageData.pageSize,
        }}
        view={view}
        isLoading={isLoading}
        onViewChange={handleViewChange}
        filterParams={filterParams}
        toolbar={DataTableToolbar}
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        renderCard={(row, { isMobile }) => (
          <ExperienceCard experience={row.original} showActionsOnClick={isMobile} />
        )}
      />
    </div>
  );
}
