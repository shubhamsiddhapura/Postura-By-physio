import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import { updateTestimonialSchema } from "@/lib/validations/testimonial";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeTestimonial } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/** GET /api/testimonials/:id — fetch a single testimonial. */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const item = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });
    if (!item) return fail("Testimonial not found", 404);
    return ok(serializeTestimonial(item));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/testimonials/:id — partial update. Any create-schema field
 * may be supplied.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = updateTestimonialSchema.parse(body);

    const data: Prisma.TestimonialUpdateInput = {};
    if (input.tag !== undefined) data.tag = input.tag;
    if (input.quote !== undefined) data.quote = input.quote;
    if (input.name !== undefined) data.name = input.name;
    if (input.age !== undefined) data.age = input.age;
    if (input.avatar !== undefined) data.avatar = input.avatar;
    if (input.order !== undefined) data.order = input.order;
    if (input.published !== undefined) data.published = input.published;

    const updated = await prisma.testimonial.update({
      where: { id: params.id },
      data,
    });

    return ok(serializeTestimonial(updated));
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE /api/testimonials/:id */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.testimonial.delete({
      where: { id: params.id },
    });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
