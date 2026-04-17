import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import {
  createGalleryImageSchema,
  listGalleryQuerySchema,
} from "@/lib/validations/gallery";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeGalleryImage } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/gallery
 * List gallery images, optionally filtered to a single category.
 *
 * Query params:
 *   - category  (physiotherapy | aerobics | yoga | pilates | corporate)
 *   - page      (default 1)
 *   - limit     (default 100, max 200)
 *
 * Items are returned in `(order asc, createdAt asc)` so the public page
 * gets a stable layout without needing a second sort pass.
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, category } = listGalleryQuerySchema.parse(params);

    const where: Prisma.GalleryImageWhereInput = {};
    if (category) where.category = category as Prisma.GalleryImageWhereInput["category"];

    const [items, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.galleryImage.count({ where }),
    ]);

    return ok(items.map(serializeGalleryImage), {
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
 * POST /api/gallery
 * Add a new image to a category. If `order` is omitted the new row is
 * appended to the end of its category (max + 1).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createGalleryImageSchema.parse(body);

    let order = input.order;
    if (order === undefined) {
      const last = await prisma.galleryImage.findFirst({
        where: { category: input.category as Prisma.GalleryImageWhereInput["category"] },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (last?.order ?? -1) + 1;
    }

    const created = await prisma.galleryImage.create({
      data: {
        url: input.url,
        alt: input.alt,
        category: input.category as Prisma.GalleryImageCreateInput["category"],
        order,
      },
    });

    return ok(serializeGalleryImage(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
