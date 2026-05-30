import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

import { fail, handleError, ok } from "@/lib/api/response";
import { testimonialShareInviteEmail } from "@/lib/mail/templates/testimonialShareInvite";
import { sendMail } from "@/lib/mail/mailer";
import { getShareStoryFormUrl } from "@/lib/share-story-url";
import { sendTestimonialShareInviteSchema } from "@/lib/validations/testimonial";

export const dynamic = "force-dynamic";

function getInternalSecret(): string | undefined {
  return process.env.ADMIN_INTERNAL_API_SECRET?.trim();
}

function timingSafeBearerMatches(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function parseBearer(req: NextRequest): string | null {
  const raw = req.headers.get("authorization");
  const m = raw?.match(/^Bearer\s+(.+)$/i);
  const token = m?.[1]?.trim();
  return token || null;
}

/**
 * POST /api/internal/testimonials/send-share-invite
 * Server-to-server only: Authorization Bearer ADMIN_INTERNAL_API_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    const expected = getInternalSecret();
    if (!expected) {
      return fail("Invite email is not configured (missing ADMIN_INTERNAL_API_SECRET)", 503);
    }

    const bearer = parseBearer(req);
    if (!bearer || !timingSafeBearerMatches(bearer, expected)) {
      return fail("Unauthorized", 401);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const { email } = sendTestimonialShareInviteSchema.parse(body);
    const formUrl = getShareStoryFormUrl();
    const tpl = testimonialShareInviteEmail({ formUrl });

    const result = await sendMail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });

    return ok({
      delivered: result.sent,
      messageId: result.messageId,
      skippedReason: result.skippedReason ?? undefined,
    });
  } catch (err) {
    return handleError(err);
  }
}
