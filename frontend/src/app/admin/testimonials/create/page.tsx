import { createTestimonial } from "../actions";
import { TestimonialForm } from "../components/testimonial-form";

export default function NewTestimonialPage() {
    return (
        <TestimonialForm
            title="Add New Testimonial"
            action={createTestimonial}
        />
    );
}
