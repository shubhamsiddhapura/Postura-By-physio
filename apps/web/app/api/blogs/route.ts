import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import { createBlogSchema, listBlogsQuerySchema } from "@/lib/validations/blog";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeBlog } from "@/lib/api/serializers";
import { slugify } from "@/lib/api/slug";

export const dynamic = "force-dynamic";

/**
 * GET /api/blogs
 * List blogs with pagination + optional filters.
 *
 * Query params:
 *   - page       (number, default 1)
 *   - limit      (number, default 10, max 100)
 *   - published  ("true" | "false")
 *   - search     (string, matches title/excerpt)
 *   - tag        (string, must be in tags array)
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, published, search, tag } =
      listBlogsQuerySchema.parse(params);

    const where: Prisma.BlogWhereInput = {};
    if (typeof published === "boolean") where.published = published;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return ok(items.map(serializeBlog), {
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
 * POST /api/blogs
 * Create a new blog. `slug` is auto-generated from `title` if omitted.
 * If `published` is true and `publishedAt` is omitted, it defaults to "now".
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createBlogSchema.parse(body);

    const slug = input.slug ?? slugify(input.title);
    if (!slug) return fail("Could not derive a valid slug from title", 422);

    const publishedAt =
      input.publishedAt !== undefined
        ? input.publishedAt
          ? new Date(input.publishedAt)
          : null
        : input.published
          ? new Date()
          : null;

    const created = await prisma.blog.create({
      data: {
        // Hero
        title: input.title,
        slug,
        eyebrow: input.eyebrow,
        excerpt: input.excerpt,
        imageSrc: input.imageSrc,
        ...(input.author ? { author: input.author } : {}),
        tags: input.tags ?? [],
        published: input.published ?? false,
        publishedAt,

        // Introduction
        introEyebrow: input.introEyebrow,
        introTitle: input.introTitle,
        introDescription: input.introDescription,
        introDescription2: input.introDescription2 ?? null,
        introImageSrc: input.introImageSrc,
        introImageAlt: input.introImageAlt ?? null,

        // Causes (optional)
        causesEyebrow: input.causesEyebrow ?? null,
        causesTitle: input.causesTitle ?? null,
        causesDescription: input.causesDescription ?? null,
        causesColumns: input.causesColumns ?? null,
        causesItems:
          input.causesItems && input.causesItems.length > 0
            ? (input.causesItems as Prisma.InputJsonValue)
            : Prisma.JsonNull,

        // Symptoms
        symptomsEyebrow: input.symptomsEyebrow,
        symptomsTitle: input.symptomsTitle,
        symptomsDescription: input.symptomsDescription,
        symptomsBullets: input.symptomsBullets,
        symptomsImageSrc: input.symptomsImageSrc,
        symptomsImageAlt: input.symptomsImageAlt ?? null,
        symptomsFlipImage: input.symptomsFlipImage ?? false,

        // Solutions (optional)
        solutionsEyebrow: input.solutionsEyebrow ?? null,
        solutionsTitle: input.solutionsTitle ?? null,
        solutionsDescription: input.solutionsDescription ?? null,
        solutionsItems:
          input.solutionsItems && input.solutionsItems.length > 0
            ? (input.solutionsItems as Prisma.InputJsonValue)
            : Prisma.JsonNull,

        // Conclusion (optional)
        conclusionTitle: input.conclusionTitle ?? null,
        conclusionParagraphs: input.conclusionParagraphs ?? [],
      },
    });

    return ok(serializeBlog(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
