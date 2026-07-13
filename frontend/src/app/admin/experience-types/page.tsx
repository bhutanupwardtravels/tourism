import { getExperienceTypes } from "./actions";
import { ExperienceTypesTable } from "./components/experience-types-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Experience Types" };

interface ExperienceTypesPageProps {
    searchParams: Promise<{ page?: string; page_size?: string; title?: string }>;
}

export default async function ExperienceTypesPage({ searchParams }: ExperienceTypesPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 6;
    const title = params.title || undefined;

    const data = await getExperienceTypes(page, pageSize, title);

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
            <ExperienceTypesTable
                data={data.items}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
