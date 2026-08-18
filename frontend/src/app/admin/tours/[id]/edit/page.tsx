import { getTourById, updateTourAction } from "../../actions";
import { notFound } from "next/navigation";
import { TourForm } from "../../components/tour-form";
import { getAllCosts } from "@/lib/data/settings";
import { initialActionState } from "@/lib/action-state";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTourPage({ params }: PageProps) {
    const { id } = await params;

    const [tour, costs] = await Promise.all([
        getTourById(id),
        getAllCosts()
    ]);

    if (!tour) {
        notFound();
    }

    const updateTourWithId = updateTourAction.bind(null, id, initialActionState);

    return (
        <TourForm
            initialData={tour}
            title={`Edit Tour: ${tour.title}`}
            action={updateTourWithId}
            allCosts={costs}
        />
    );
}
