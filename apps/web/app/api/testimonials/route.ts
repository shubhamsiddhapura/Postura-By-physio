import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import {
  createTestimonialSchema,
  listTestimonialsQuerySchema,
} from "@/lib/validations/testimonial";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeTestimonial } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/testimonials
 * List testimonials, sorted by `order asc, createdAt desc` so newer reviews
 * appear first when `order` ties.
 *
 * Query params:
 *   - page       (default 1)
 *   - limit      (default 100, max 200)
 *   - published  ("true" | "false")
 *   - search     (matches name/quote, case-insensitive)
 *   - tag        (exact tag match, e.g. "Student")
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, published, search, tag } =
      listTestimonialsQuerySchema.parse(params);

    const where: Prisma.TestimonialWhereInput = {};
    if (typeof published === "boolean") where.published = published;
    if (tag) where.tag = tag;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { quote: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return ok(items.map(serializeTestimonial), {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/testimonials
 * Create a new testimonial. If `order` is omitted the new row is appended
 * to the end (max order + 1). `published` defaults to true.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createTestimonialSchema.parse(body);

    let order = input.order;
    if (order === undefined) {
      const last = await prisma.testimonial.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (last?.order ?? -1) + 1;
    }

    const created = await prisma.testimonial.create({
      data: {
        tag: input.tag,
        quote: input.quote,
        name: input.name,
        age: input.age,
        avatar: input.avatar,
        order,
        published: input.published ?? true,
      },
    });

    return ok(serializeTestimonial(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
