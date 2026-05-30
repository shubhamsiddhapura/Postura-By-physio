import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import {
  createCertificationSchema,
  listCertificationsQuerySchema,
} from "@/lib/validations/certification";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeCertification } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/certifications
 * List certifications, sorted by `(order asc, createdAt asc)` so the
 * public marquee gets a stable left-to-right layout.
 *
 * Query params:
 *   - page       (default 1)
 *   - limit      (default 100, max 200)
 *   - published  ("true" | "false")
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, published } =
      listCertificationsQuerySchema.parse(params);

    const where: Prisma.CertificationWhereInput = {};
    if (typeof published === "boolean") where.published = published;

    const [items, total] = await Promise.all([
      prisma.certification.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certification.count({ where }),
    ]);

    return ok(items.map(serializeCertification), {
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
 * POST /api/certifications
 * Create a new certification. If `order` is omitted the new row is
 * appended to the end (max order + 1). `published` defaults to true.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createCertificationSchema.parse(body);

    let order = input.order;
    if (order === undefined) {
      const last = await prisma.certification.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (last?.order ?? -1) + 1;
    }

    const created = await prisma.certification.create({
      data: {
        imageUrl: input.imageUrl,
        title: input.title,
        alt: input.alt,
        order,
        published: input.published ?? true,
      },
    });

    return ok(serializeCertification(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
