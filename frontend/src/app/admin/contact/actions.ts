"use server";

import { revalidatePath } from "next/cache";
import { getContactContent, updateContactContent, ContactContent } from "@/lib/data/contact";
import { getAdminUser as auth } from "@/lib/supabase/server";

export async function getContactContentAction(): Promise<ContactContent> {
    try {
        const content = await getContactContent();
        return JSON.parse(JSON.stringify(content));
    } catch (error) {
        throw new Error("Failed to fetch contact content");
    }
}

export async function updateContactContentAction(data: ContactContent) {
    const session = await auth();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await updateContactContent(data);

        revalidatePath("/admin/contact");
        // Header/footer render the contact data on every public page
        revalidatePath("/", "layout");

        return { success: true, message: "Contact details updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update contact details" };
    }
}
