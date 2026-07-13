import { listCosts } from "./actions";
import { SettingsTable } from "./components/settings-table";
import { Cost } from "./schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fee Settings" };

interface SettingsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        title?: string;
        travelerCategory?: string;
        isIndianNational?: string;
    }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;
    const title = params.title || "";
    const travelerCategory = params.travelerCategory || "";
    const isIndianNational = params.isIndianNational || "";

    const data = await listCosts(page, pageSize, title, { travelerCategory, isIndianNational });

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
            <SettingsTable
                data={data.items as Cost[]}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
