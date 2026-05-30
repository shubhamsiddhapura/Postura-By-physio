import nodemailer, { type Transporter } from "nodemailer";

/**
 * Thin wrapper around nodemailer so the rest of the app doesn't care how
 * email is delivered.
 *
 * Behaviour:
 *   - When SMTP env vars are configured a real transporter is used.
 *   - When they are missing (typical in dev) the message is logged to the
 *     server console and `sendMail` still resolves successfully. That way
 *     booking creation never fails just because mail isn't set up yet.
 *
 * Required env (all or nothing):
 *   SMTP_HOST        e.g. "smtp.gmail.com" / "smtp.resend.com"
 *   SMTP_PORT        e.g. "587" or "465"
 *   SMTP_USER        SMTP login username
 *   SMTP_PASSWORD    SMTP login password / api key
 *   SMTP_SECURE      "true" to force TLS on port 465 (default: auto based on port)
 *   MAIL_FROM        e.g. "Postura by Physio <bookings@posturabyphysio.com>"
 *
 * Optional:
 *   BOOKINGS_NOTIFY_EMAIL  Where the admin notification is sent.
 *                          Defaults to MAIL_FROM if unset.
 */

export type MailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type MailSendResult = {
  /** true if the transporter actually attempted delivery. */
  sent: boolean;
  /** nodemailer messageId when delivered, otherwise null. */
  messageId: string | null;
  /** reason the email was not sent (for logging). */
  skippedReason?: string;
};

let cachedTransporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (cachedTransporter !== undefined) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  if (!host || !portRaw || !user || !pass) {
    cachedTransporter = null;
    return null;
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    console.warn(`[mailer] invalid SMTP_PORT="${portRaw}"; disabling mail.`);
    cachedTransporter = null;
    return null;
  }

  // `secure` true for 465, false for 587/2525 — unless explicitly overridden.
  const secureOverride = process.env.SMTP_SECURE?.toLowerCase();
  const secure =
    secureOverride === "true"
      ? true
      : secureOverride === "false"
        ? false
        : port === 465;

  // Escape hatch for dev machines where antivirus / corporate proxies do TLS
  // interception and Node trips on "self-signed certificate in certificate
  // chain" during CONN. HARD-DISABLED in production regardless of the env
  // value — shipping with cert verification off would make every email
  // MITM-able. If someone set it on Vercel, log an error and fall back
  // to normal verification so delivery still works.
  const tlsInsecureRequested =
    process.env.SMTP_TLS_INSECURE?.toLowerCase() === "true";
  const isProd = process.env.NODE_ENV === "production";
  const tlsInsecure = tlsInsecureRequested && !isProd;

  if (tlsInsecureRequested && isProd) {
    console.error(
      "[mailer] SMTP_TLS_INSECURE=true was set in production — IGNORED. " +
        "Remove this variable from the Vercel project environment. " +
        "Cert verification stays ON."
    );
  } else if (tlsInsecure) {
    console.warn(
      "[mailer] SMTP_TLS_INSECURE=true — certificate verification disabled. " +
        "Use for local development only."
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: tlsInsecure ? { rejectUnauthorized: false } : undefined,
  });
  return cachedTransporter;
}

export function getMailFrom(): string {
  return (
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "no-reply@postura.local"
  );
}

export function getAdminNotifyAddress(): string {
  return process.env.BOOKINGS_NOTIFY_EMAIL?.trim() || getMailFrom();
}

export async function sendMail(msg: MailMessage): Promise<MailSendResult> {
  const transporter = getTransporter();

  if (!transporter) {
    console.info(
      "[mailer] SMTP not configured — logging email instead of sending.\n" +
        `  to:      ${Array.isArray(msg.to) ? msg.to.join(", ") : msg.to}\n` +
        `  subject: ${msg.subject}`
    );
    return {
      sent: false,
      messageId: null,
      skippedReason: "SMTP not configured",
    };
  }

  const recipients = Array.isArray(msg.to) ? msg.to.join(", ") : msg.to;

  try {
    const info = await transporter.sendMail({
      from: getMailFrom(),
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo,
    });
    console.info(
      `[mailer] sent → ${recipients} · "${msg.subject}" · id=${info.messageId ?? "?"}`
    );
    return { sent: true, messageId: info.messageId ?? null };
  } catch (err) {
    // Never throw — callers treat mail as best-effort. Log clearly so
    // Vercel's Functions tab makes the failure reason obvious.
    const reason = err instanceof Error ? err.message : "unknown error";
    console.error(
      `[mailer] send FAILED → ${recipients} · "${msg.subject}" · reason=${reason}`
    );
    return {
      sent: false,
      messageId: null,
      skippedReason: reason,
    };
  }
}
