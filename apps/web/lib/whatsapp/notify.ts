/**
 * Thin wrapper around the CallMeBot WhatsApp API.
 * https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * One-time setup (doctor does this once):
 *   1. Save +34 644 59 77 39 as a WhatsApp contact.
 *   2. Send it the message: "I allow callmebot to send me messages"
 *   3. You'll receive an API key in reply — put it in CALLMEBOT_WHATSAPP_APIKEY.
 *
 * Required env vars:
 *   CALLMEBOT_WHATSAPP_PHONE   Doctor's WhatsApp number with country code, no +
 *                              e.g. "916354011290"
 *   CALLMEBOT_WHATSAPP_APIKEY  API key received from CallMeBot
 *
 * When either var is missing the call is skipped and a warning is logged —
 * the contact form still succeeds so a misconfigured WhatsApp never blocks email delivery.
 */

export type WaNotifyResult = {
  sent: boolean;
  skippedReason?: string;
};

export async function sendWhatsAppNotification(
  text: string
): Promise<WaNotifyResult> {
  const phone = process.env.CALLMEBOT_WHATSAPP_PHONE?.trim();
  const apiKey = process.env.CALLMEBOT_WHATSAPP_APIKEY?.trim();

  if (!phone || !apiKey) {
    console.info(
      "[whatsapp] CallMeBot not configured — skipping WhatsApp notification.\n" +
        "  Set CALLMEBOT_WHATSAPP_PHONE and CALLMEBOT_WHATSAPP_APIKEY to enable."
    );
    return { sent: false, skippedReason: "CallMeBot not configured" };
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }

    console.info(`[whatsapp] notification sent to ${phone}`);
    return { sent: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    console.error(`[whatsapp] send FAILED to ${phone} · reason=${reason}`);
    // Never throw — WhatsApp is best-effort, just like email.
    return { sent: false, skippedReason: reason };
  }
}

/** Build a compact, readable WhatsApp message from contact form data. */
export function buildContactWhatsAppMessage(data: {
  fullName: string;
  phone: string;
  email: string;
  service?: string | null;
  address?: string | null;
  message?: string | null;
}): string {
  const lines: string[] = [
    "📋 *New Contact Form Submission*",
    "",
    `👤 *Name:* ${data.fullName}`,
    `📞 *Phone:* ${data.phone}`,
    `📧 *Email:* ${data.email}`,
  ];

  if (data.service) lines.push(`🏥 *Service:* ${data.service}`);
  if (data.address) lines.push(`📍 *Address:* ${data.address}`);
  if (data.message) lines.push(`💬 *Message:* ${data.message}`);

  lines.push("", "— Postura by Physio Website");

  return lines.join("\n");
}
