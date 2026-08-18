"use server";

import { revalidatePath } from "next/cache";
import {
    getOperatorEmailsContent,
    updateOperatorEmailsContent,
    OperatorEmailsContent,
} from "@/lib/data/operator-emails";
import { getAdminUser as auth } from "@/lib/supabase/server";

export async function getOperatorEmailsAction(): Promise<OperatorEmailsContent> {
    try {
        const content = await getOperatorEmailsContent();
        return JSON.parse(JSON.stringify(content));
    } catch {
        throw new Error("Failed to fetch operator emails");
    }
}

export async function updateOperatorEmailsAction(data: { emails: string[] }) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await updateOperatorEmailsContent(data);
        revalidatePath("/admin/notifications");
        return { success: true, message: "Notification emails updated successfully" };
    } catch {
        return { success: false, message: "Failed to update notification emails" };
    }
}
