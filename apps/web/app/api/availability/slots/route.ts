import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

import { createAvailabilitySlotSchema } from "@/lib/validations/availability";
import { fail, handleError, ok } from "@/lib/api/response";
import { serializeAvailabilitySlot } from "@/lib/api/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability/slots — list every slot in the weekly template.
 * Ordered Sun..Sat then chronologically within each day so the admin grid
 * can render straight from the response.
 */
export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { sortKey: "asc" }],
    });
    return ok(slots.map(serializeAvailabilitySlot));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/availability/slots — add a single slot to the weekly template.
 * Body: `{ dayOfWeek: 0..6, time: "10:00 AM" }`. The `time` string is
 * normalised and stored alongside a computed sortKey (minutes of day).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createAvailabilitySlotSchema.parse(body);

    const created = await prisma.availabilitySlot.create({
      data: {
        dayOfWeek: input.dayOfWeek,
        time: input.time.display,
        sortKey: input.time.minutes,
      },
    });

    return ok(serializeAvailabilitySlot(created), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
