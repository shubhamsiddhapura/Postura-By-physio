import { NextRequest } from "next/server";

import { createContactSchema } from "@/lib/validations/contact";
import { fail, handleError, ok } from "@/lib/api/response";
import { getAdminNotifyAddress, sendMail } from "@/lib/mail/mailer";
import { adminContactEmail, customerContactEmail } from "@/lib/mail/templates/contact";
import {
  buildContactWhatsAppMessage,
  sendWhatsAppNotification,
} from "@/lib/whatsapp/notify";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Public-facing endpoint for the Contact Us form.
 *
 * On success:
 *  1. Sends a notification email to the admin (reply-to = visitor's email).
 *  2. Sends a confirmation email to the visitor.
 *  3. Sends a silent WhatsApp notification to the doctor via CallMeBot
 *     (best-effort — a missing/misconfigured API key never blocks the response).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("Invalid JSON body", 400);
    }

    const input = createContactSchema.parse(body);

    const adminAddr = getAdminNotifyAddress();

    // Emails and WhatsApp run concurrently — none blocks the other.
    const adminTpl = adminContactEmail(input);
    const customerTpl = customerContactEmail(input);
    const waText = buildContactWhatsAppMessage(input);

    await Promise.all([
      sendMail({
        to: adminAddr,
        subject: adminTpl.subject,
        html: adminTpl.html,
        text: adminTpl.text,
        replyTo: input.email,
      }),
      sendMail({
        to: input.email,
        subject: customerTpl.subject,
        html: customerTpl.html,
        text: customerTpl.text,
      }),
      sendWhatsAppNotification(waText),
    ]);

    return ok({ message: "Message sent successfully" }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
