import { TourForm } from "../components/tour-form";
import { createTourAction } from "../actions";
import { getAllCosts } from "@/lib/data/settings";
import { initialActionState } from "@/lib/action-state";

export default async function NewTourPage() {
    const allCosts = await getAllCosts();
    const createTourWithPrevState = createTourAction.bind(null, initialActionState);

    return (
        <TourForm
            title="Create New Tour"
            action={createTourWithPrevState}
            allCosts={allCosts}
        />
    );
}
