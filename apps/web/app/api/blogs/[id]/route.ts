import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import { updateBlogSchema } from "@/lib/validations/blog";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeBlog } from "@/lib/api/serializers";
import { slugify } from "@/lib/api/slug";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/**
 * Look up a blog by either its primary-key `id` (cuid) OR its `slug`.
 * This lets the public web pages keep using `/blogs/[id]` URLs while the
 * admin can address records by their cuid.
 */
function buildWhere(idOrSlug: string): Prisma.BlogWhereUniqueInput {
  const looksLikeCuid = /^c[a-z0-9]{20,}$/i.test(idOrSlug);
  return looksLikeCuid ? { id: idOrSlug } : { slug: idOrSlug };
}

/**
 * Translate a Zod-parsed optional section-items array into a Prisma Json input.
 *   - `undefined` -> don't touch the column
 *   - `null`      -> clear the column (Prisma.JsonNull)
 *   - `[]`        -> clear the column (treat empty arrays as "no section")
 *   - `[...]`     -> write the array as JSON
 */
function toJsonItems(
  value: unknown
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  if (Array.isArray(value) && value.length === 0) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

/**
 * GET /api/blogs/:id
 * Fetch a single blog by id or slug.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const blog = await prisma.blog.findUnique({ where: buildWhere(params.id) });
    if (!blog) return fail("Blog not found", 404);
    return ok(serializeBlog(blog));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/blogs/:id
 * Partially update a blog. Any field from the create schema may be supplied.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = updateBlogSchema.parse(body);

    const data: Prisma.BlogUpdateInput = {};

    // Hero
    if (input.title !== undefined) data.title = input.title;
    if (input.slug !== undefined) data.slug = input.slug;
    else if (input.title !== undefined) data.slug = slugify(input.title);
    if (input.eyebrow !== undefined) data.eyebrow = input.eyebrow;
    if (input.excerpt !== undefined) data.excerpt = input.excerpt;
    if (input.imageSrc !== undefined) data.imageSrc = input.imageSrc;
    if (input.author !== undefined) data.author = input.author;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.published !== undefined) data.published = input.published;
    if (input.publishedAt !== undefined) {
      data.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    } else if (input.published === true) {
      // auto-set publishedAt when flipping to published for the first time
      const existing = await prisma.blog.findUnique({
        where: buildWhere(params.id),
        select: { publishedAt: true },
      });
      if (existing && !existing.publishedAt) data.publishedAt = new Date();
    }

    // Introduction
    if (input.introEyebrow !== undefined) data.introEyebrow = input.introEyebrow;
    if (input.introTitle !== undefined) data.introTitle = input.introTitle;
    if (input.introDescription !== undefined)
      data.introDescription = input.introDescription;
    if (input.introDescription2 !== undefined)
      data.introDescription2 = input.introDescription2 ?? null;
    if (input.introImageSrc !== undefined)
      data.introImageSrc = input.introImageSrc;
    if (input.introImageAlt !== undefined)
      data.introImageAlt = input.introImageAlt ?? null;

    // Causes
    if (input.causesEyebrow !== undefined)
      data.causesEyebrow = input.causesEyebrow ?? null;
    if (input.causesTitle !== undefined)
      data.causesTitle = input.causesTitle ?? null;
    if (input.causesDescription !== undefined)
      data.causesDescription = input.causesDescription ?? null;
    if (input.causesColumns !== undefined)
      data.causesColumns = input.causesColumns ?? null;
    const causesItems = toJsonItems(input.causesItems);
    if (causesItems !== undefined) data.causesItems = causesItems;

    // Symptoms
    if (input.symptomsEyebrow !== undefined)
      data.symptomsEyebrow = input.symptomsEyebrow;
    if (input.symptomsTitle !== undefined)
      data.symptomsTitle = input.symptomsTitle;
    if (input.symptomsDescription !== undefined)
      data.symptomsDescription = input.symptomsDescription;
    if (input.symptomsBullets !== undefined)
      data.symptomsBullets = input.symptomsBullets;
    if (input.symptomsImageSrc !== undefined)
      data.symptomsImageSrc = input.symptomsImageSrc;
    if (input.symptomsImageAlt !== undefined)
      data.symptomsImageAlt = input.symptomsImageAlt ?? null;
    if (input.symptomsFlipImage !== undefined)
      data.symptomsFlipImage = input.symptomsFlipImage;

    // Solutions
    if (input.solutionsEyebrow !== undefined)
      data.solutionsEyebrow = input.solutionsEyebrow ?? null;
    if (input.solutionsTitle !== undefined)
      data.solutionsTitle = input.solutionsTitle ?? null;
    if (input.solutionsDescription !== undefined)
      data.solutionsDescription = input.solutionsDescription ?? null;
    const solutionsItems = toJsonItems(input.solutionsItems);
    if (solutionsItems !== undefined) data.solutionsItems = solutionsItems;

    // Conclusion
    if (input.conclusionTitle !== undefined)
      data.conclusionTitle = input.conclusionTitle ?? null;
    if (input.conclusionParagraphs !== undefined)
      data.conclusionParagraphs = input.conclusionParagraphs;

    const updated = await prisma.blog.update({
      where: buildWhere(params.id),
      data,
    });

    return ok(serializeBlog(updated));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/blogs/:id
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.blog.delete({ where: buildWhere(params.id) });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
