import { getExperiences } from "./actions";
import { ExperiencesTable } from "./components/experiences-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Experiences" };

interface ExperiencesPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        title?: string;
        category?: string;
    }>;
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 6;
    const title = params.title || undefined;
    const category = params.category || undefined;

    const data = await getExperiences(page, pageSize, title, category);

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
            <ExperiencesTable
                data={data.items}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
