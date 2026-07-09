import { supabaseAdmin } from "../supabase/admin";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { paginate } from "../supabase/mapping";

// Admin users live in Supabase Auth (auth.users), not an app table.
// username/role are stored in metadata: role in app_metadata so it can only
// be set server-side, username in user_metadata.

const formatUser = (user: SupabaseUser | null | undefined) => {
    if (!user) return null;
    return {
        id: user.id,
        _id: user.id,
        username: (user.user_metadata?.username as string) ?? user.email ?? "",
        email: user.email ?? "",
        role: ((user.app_metadata?.role as string) ?? "user") as "admin" | "user",
        createdAt: user.created_at,
        updatedAt: user.updated_at ?? user.created_at,
    };
};

// The admin panel manages a handful of users, so fetch one large page and
// paginate/search in JS rather than juggling GoTrue pagination.
async function fetchAllUsers(): Promise<SupabaseUser[]> {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    return data.users;
}

export async function listUsers(page: number = 1, pageSize: number = 10, search?: string) {
    let users = await fetchAllUsers();

    if (search) {
        const needle = search.toLowerCase();
        users = users.filter(
            (u) =>
                (u.email ?? "").toLowerCase().includes(needle) ||
                ((u.user_metadata?.username as string) ?? "").toLowerCase().includes(needle)
        );
    }

    users.sort((a, b) =>
        ((a.user_metadata?.username as string) ?? a.email ?? "").localeCompare(
            (b.user_metadata?.username as string) ?? b.email ?? ""
        )
    );

    const totalItems = users.length;
    const start = (page - 1) * pageSize;
    const items = users.slice(start, start + pageSize).map(formatUser);

    return {
        items,
        ...paginate(totalItems, page, pageSize),
    };
}

export async function getUserById(id: string) {
    try {
        const supabase = supabaseAdmin();
        const { data, error } = await supabase.auth.admin.getUserById(id);
        if (error) return null;
        return formatUser(data.user);
    } catch (e) {
        return null;
    }
}

export async function getUserByEmail(email: string) {
    const users = await fetchAllUsers();
    const user = users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    return formatUser(user);
}

export async function createUser(data: { username: string; email: string; role?: string; password: string }) {
    const supabase = supabaseAdmin();
    const { data: created, error } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { username: data.username },
        app_metadata: { role: data.role || "admin" },
    });
    if (error) throw error;
    return created.user.id;
}

export async function updateUser(
    id: string,
    data: { username?: string; email?: string; role?: string; password?: string }
) {
    const supabase = supabaseAdmin();

    const attributes: Record<string, any> = {};
    if (data.email) attributes.email = data.email;
    if (data.password) attributes.password = data.password;
    if (data.username) attributes.user_metadata = { username: data.username };
    if (data.role) attributes.app_metadata = { role: data.role };

    const { error } = await supabase.auth.admin.updateUserById(id, attributes);
    if (error) throw error;
    return { acknowledged: true };
}

export async function deleteUser(id: string) {
    const supabase = supabaseAdmin();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    return { acknowledged: true };
}
