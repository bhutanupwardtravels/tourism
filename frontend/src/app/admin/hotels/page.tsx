import { getHotels } from "./actions";
import { HotelsTable } from "./components/hotels-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hotels" };

export default async function HotelsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; page_size?: string; name?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 6;
    const name = params.name || undefined;

    const data = await getHotels(page, pageSize, name);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-black">Hotels</h1>
                <p className="text-sm text-black mt-1">
                    Manage hotels and accommodations
                </p>
            </div>
            <HotelsTable
                data={data.items}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
