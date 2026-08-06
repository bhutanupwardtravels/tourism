import { notFound } from "next/navigation";
import { getTestimonialById } from "../actions";
import { TestimonialForm } from "../components/testimonial-form";

interface TestimonialViewPageProps {
    params: Promise<{ id: string }>;
}

export default async function TestimonialViewPage({ params }: TestimonialViewPageProps) {
    const { id } = await params;
    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
        notFound();
    }

    return (
        <TestimonialForm
            title={testimonial.name}
            initialData={testimonial}
            isReadOnly
        />
    );
}
