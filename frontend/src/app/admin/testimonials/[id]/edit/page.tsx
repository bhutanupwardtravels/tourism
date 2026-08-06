import { notFound } from "next/navigation";
import { getTestimonialById, updateTestimonial } from "../../actions";
import { TestimonialForm } from "../../components/testimonial-form";

interface EditTestimonialPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
    const { id } = await params;
    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
        notFound();
    }

    const updateActionWithId = updateTestimonial.bind(null, id);

    return (
        <TestimonialForm
            title={`Edit Testimonial: ${testimonial.name}`}
            initialData={testimonial}
            action={updateActionWithId}
        />
    );
}
