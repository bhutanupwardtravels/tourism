import { getTours } from "./actions";
import { ToursTable } from "./components/tours-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tours" };

interface ToursPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        category?: string;
        title?: string;
    }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;
    const category = params.category ? params.category.split(",") : undefined;
    const title = params.title || undefined;

    const data = await getTours(page, pageSize, category, title);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    Expeditions & Tours
                </h2>
                <p className="text-sm text-neutral-500">
                    Manage your curated travel journeys and luxury itineraries.
                </p>
            </div>
            <ToursTable
                data={data.items}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
