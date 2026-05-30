import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import { updateGalleryImageSchema } from "@/lib/validations/gallery";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeGalleryImage } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/**
 * GET /api/gallery/:id
 * Fetch a single gallery image. Used by the admin edit screen.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    });
    if (!image) return fail("Gallery image not found", 404);
    return ok(serializeGalleryImage(image));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/gallery/:id
 * Partial update — any field from the create schema may be supplied.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = updateGalleryImageSchema.parse(body);

    const data: Prisma.GalleryImageUpdateInput = {};
    if (input.url !== undefined) data.url = input.url;
    if (input.alt !== undefined) data.alt = input.alt;
    if (input.category !== undefined)
      data.category = input.category as Prisma.GalleryImageUpdateInput["category"];
    if (input.order !== undefined) data.order = input.order;

    const updated = await prisma.galleryImage.update({
      where: { id: params.id },
      data,
    });

    return ok(serializeGalleryImage(updated));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/gallery/:id
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.galleryImage.delete({
      where: { id: params.id },
    });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
