import { supabaseAdmin } from "../supabase/admin";
import { rowToDoc, docToRow, pageRange } from "../supabase/mapping";
import { RequestStatus, TourRequest } from "@/app/admin/tour-requests/types";

const TABLE = "tour_requests";

const COLUMNS = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "destination",
    "travel_date",
    "travelers",
    "message",
    "tour_id",
    "tour_name",
    "status",
];

export const tourRequestDb = {
    async getAllTourRequests(page = 1, limit = 10, status?: RequestStatus | RequestStatus[], search?: string) {
        const supabase = supabaseAdmin();

        // `estimated` returns an exact count for small tables and a fast planner
        // estimate once the table grows, avoiding a full count scan per page load.
        let query = supabase.from(TABLE).select("*", { count: "estimated" });
        if (status) {
            query = Array.isArray(status)
                ? query.in("status", status)
                : query.eq("status", status);
        }
        if (search) {
            query = query.ilike("email", `%${search}%`);
        }

        const [from, to] = pageRange(page, limit);
        const { data, count, error } = await query
            .order("created_at", { ascending: false })
            .range(from, to);
        if (error) throw error;

        const total = count ?? 0;
        return {
            items: (data ?? []).map(rowToDoc) as TourRequest[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    async getTourRequestById(id: string) {
        const supabase = supabaseAdmin();
        const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
        return data ? (rowToDoc(data) as TourRequest) : null;
    },

    async createTourRequest(data: Omit<TourRequest, "_id" | "createdAt" | "updatedAt" | "status">) {
        const supabase = supabaseAdmin();
        const { data: inserted, error } = await supabase
            .from(TABLE)
            .insert({ ...docToRow(data, COLUMNS), status: RequestStatus.PENDING })
            .select("*")
            .single();
        if (error) throw error;
        return rowToDoc(inserted) as TourRequest;
    },

    async updateTourRequestStatus(id: string, status: RequestStatus) {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase
            .from(TABLE)
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select("id");
        if (error) throw error;
        return (data ?? []).length > 0;
    },

    async deleteTourRequest(id: string) {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase
            .from(TABLE)
            .delete()
            .eq("id", id)
            .select("id");
        if (error) throw error;
        return (data ?? []).length > 0;
    }
};
