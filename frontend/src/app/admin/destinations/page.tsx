import { getDestinations } from "./actions";
import { DestinationsTable } from "./components/destinations-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Destinations" };

interface DestinationsPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        name?: string;
        region?: string;
        isEntryPoint?: string;
    }>;
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 6;
    const name = params.name || undefined;
    const region = params.region || undefined;
    const isEntryPoint =
        params.isEntryPoint === "true" ? true :
        params.isEntryPoint === "false" ? false : undefined;

    const data = await getDestinations(page, pageSize, name, region, isEntryPoint);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-black">Destinations</h1>
                <p className="text-sm text-black mt-1">
                    Manage destination locations and highlights
                </p>
            </div>
            <DestinationsTable
                data={data.items}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
