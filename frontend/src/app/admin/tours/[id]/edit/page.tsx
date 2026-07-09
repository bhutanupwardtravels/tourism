import { getTourById, updateTourAction } from "../../actions";
import { notFound } from "next/navigation";
import { TourForm } from "../../components/tour-form";
import { getAllCosts } from "@/lib/data/settings";

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

    const updateTourWithId = updateTourAction.bind(null, id, null);

    return (
        <TourForm
            initialData={tour}
            title={`Edit Tour: ${tour.title}`}
            action={updateTourWithId}
            allCosts={costs}
        />
    );
}
