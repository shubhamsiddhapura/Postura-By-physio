import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

import { handleError, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

/** DELETE /api/availability/blocked-dates/:id — unblock a date. */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const deleted = await prisma.blockedDate.delete({
      where: { id: params.id },
    });
    return ok({ id: deleted.id, deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
