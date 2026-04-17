import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

import { handleError, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/** DELETE /api/availability/slots/:id — remove a slot from the weekly template. */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.availabilitySlot.delete({
      where: { id: params.id },
    });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
