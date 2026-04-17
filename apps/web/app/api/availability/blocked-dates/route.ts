import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

import { createBlockedDateSchema } from "@/lib/validations/availability";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeBlockedDate } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability/blocked-dates — upcoming blocked dates first, then
 * past ones. The admin page uses this verbatim; the public availability
 * endpoint looks up by date directly.
 */
export async function GET() {
  try {
    const items = await prisma.blockedDate.findMany({
      orderBy: { date: "asc" },
    });
    return ok(items.map(serializeBlockedDate));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/availability/blocked-dates — block a specific calendar date.
 * Body: `{ date: "YYYY-MM-DD", reason?: string | null }`. Duplicate dates
 * return 409 via the shared error handler (Prisma P2002).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createBlockedDateSchema.parse(body);

    const created = await prisma.blockedDate.create({
      data: {
        date: new Date(`${input.date}T00:00:00Z`),
        reason: input.reason ?? null,
      },
    });

    return ok(serializeBlockedDate(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
