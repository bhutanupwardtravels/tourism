import { listUsers } from "./actions";
import { UsersTable } from "./components/users-table";
import { User } from "./schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

interface UsersPageProps {
    searchParams: Promise<{
        page?: string;
        page_size?: string;
        search?: string;
    }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;
    const search = params.search || undefined;

    const data = await listUsers(page, pageSize, search);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight text-black">
                    User Management
                </h2>
                <p className="text-sm text-neutral-500">
                    Manage system administrators and staff access levels.
                </p>
            </div>
            <UsersTable
                data={data.items as User[]}
                pageCount={data.total_pages}
                pagination={{ pageIndex: data.page - 1, pageSize: data.page_size }}
            />
        </div>
    );
}
