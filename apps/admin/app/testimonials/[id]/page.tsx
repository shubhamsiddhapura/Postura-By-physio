import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { DeleteTestimonialButton } from "@/components/testimonials/DeleteTestimonialButton";
import { ApiError, testimonialsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  let testimonial;
  try {
    const res = await testimonialsApi.get(params.id);
    testimonial = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <PageHeader
        title="Edit testimonial"
        description={`${testimonial.name} · ${testimonial.tag}`}
        actions={
          <div className="flex items-center gap-2">
            {testimonial.published ? (
              <Badge tone="green">Published</Badge>
            ) : (
              <Badge tone="amber">Hidden</Badge>
            )}
            <DeleteTestimonialButton
              id={testimonial.id}
              label={testimonial.name}
              redirectTo="/testimonials"
            />
          </div>
        }
      />
      <div className="px-8 py-6">
        <TestimonialForm mode="edit" initial={testimonial} />
      </div>
    </>
  );
}
