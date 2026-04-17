import { PageHeader } from "@/components/PageHeader";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";

export const metadata = {
  title: "New testimonial — Admin",
};

export default function NewTestimonialPage() {
  return (
    <>
      <PageHeader
        title="New testimonial"
        description="Add a patient review. Unpublish it to keep it out of the public page."
      />
      <div className="px-8 py-6">
        <TestimonialForm mode="create" />
      </div>
    </>
  );
}
