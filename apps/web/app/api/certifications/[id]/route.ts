import { NextRequest } from "next/server";
import { prisma, Prisma } from "@repo/db";

import { updateCertificationSchema } from "@/lib/validations/certification";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeCertification } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/**
 * GET /api/certifications/:id
 * Fetch a single certification. Used by the admin edit screen.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const cert = await prisma.certification.findUnique({
      where: { id: params.id },
    });
    if (!cert) return fail("Certification not found", 404);
    return ok(serializeCertification(cert));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/certifications/:id
 * Partial update — any field from the create schema may be supplied.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = updateCertificationSchema.parse(body);

    const data: Prisma.CertificationUpdateInput = {};
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
    if (input.title !== undefined) data.title = input.title;
    if (input.alt !== undefined) data.alt = input.alt;
    if (input.order !== undefined) data.order = input.order;
    if (input.published !== undefined) data.published = input.published;

    const updated = await prisma.certification.update({
      where: { id: params.id },
      data,
    });

    return ok(serializeCertification(updated));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/certifications/:id
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.certification.delete({
      where: { id: params.id },
    });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
