import { TourForm } from "@/app/admin/tours/components/tour-form";
import { getAllCosts } from "@/lib/data/settings";

async function noop() {
    "use server";
    return { success: false, message: "debug" };
}

export default async function CbDebugPage() {
    const allCosts = await getAllCosts();
    return <TourForm title="Debug Tour Form" action={noop} allCosts={allCosts} />;
}
