"use server";

import { revalidatePath } from "next/cache";
import { getFaqContent, updateFaqContent, FaqContent } from "@/lib/data/faq";
import { getAdminUser as auth } from "@/lib/supabase/server";

export async function getFaqContentAction(): Promise<FaqContent> {
    try {
        const content = await getFaqContent();
        return JSON.parse(JSON.stringify(content));
    } catch (error) {
        throw new Error("Failed to fetch FAQ content");
    }
}

export async function updateFaqContentAction(data: FaqContent) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await updateFaqContent(data);

        revalidatePath("/admin/faq");
        revalidatePath("/");
        revalidatePath("/bhutan-travel-guide");
        revalidatePath("/llms.txt");

        return { success: true, message: "FAQ content updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update FAQ content" };
    }
}
