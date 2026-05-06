import type { CreateContactInput } from "@/lib/validations/contact";

// ── Brand palette ─────────────────────────────────────────────────────────────
const BRAND          = "#008080";
const OUTER_BG       = "#f1f5f9";
const SECTION_BG     = "#f8fafc";
const SECTION_BORDER = "#e2e8f0";
const TXT_DARK       = "#1e293b";
const TXT_MED        = "#475569";
const TXT_LIGHT      = "#94a3b8";

// Logo URL must be absolute — email clients fetch it from their own network.
const _base    = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const LOGO_URL = _base ? `${_base}/admin-logo.png` : "";

// ── HTML primitives ───────────────────────────────────────────────────────────
function esc(v: string | null | undefined): string {
  if (v == null) return "";
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
  <tr>
    <td style="padding:10px 16px 10px 0;font-size:11px;font-weight:700;color:${TXT_LIGHT};text-transform:uppercase;letter-spacing:.07em;vertical-align:top;white-space:nowrap;width:34%;">${esc(label)}</td>
    <td style="padding:10px 0;font-size:14px;color:${TXT_DARK};line-height:1.6;vertical-align:top;">${esc(value)}</td>
  </tr>`;
}

function section(title: string, innerRows: string): string {
  if (!innerRows.trim()) return "";
  return `
  <div style="margin-top:24px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${BRAND};">${esc(title)}</p>
    <div style="background:${SECTION_BG};border:1px solid ${SECTION_BORDER};border-radius:10px;padding:0 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        ${innerRows}
      </table>
    </div>
  </div>`;
}

function banner(
  text: string,
  opts: { bg: string; border: string; color: string }
): string {
  return `
  <div style="background:${opts.bg};border-left:4px solid ${opts.border};border-radius:6px;padding:13px 16px;margin-bottom:24px;">
    <p style="margin:0;font-size:14px;font-weight:600;color:${opts.color};">${esc(text)}</p>
  </div>`;
}

function shell(innerHtml: string, preheader: string, accentColor = BRAND): string {
  const logoImg = LOGO_URL
    ? `<img src="${LOGO_URL}" alt="Postura by Physio" height="50" style="display:block;height:50px;width:auto;border:0;">`
    : `<span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:.04em;">Postura by Physio</span>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
</head>
<body style="margin:0;padding:0;background:${OUTER_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preheader (hidden inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:${OUTER_BG};">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${OUTER_BG};padding:40px 16px;">
    <tr><td align="center">

      <!-- Email card -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.09);">

        <!-- ── Logo / brand header ── -->
        <tr>
          <td style="background:${BRAND};padding:22px 32px;" align="left">
            ${logoImg}
          </td>
        </tr>

        <!-- Coloured accent strip -->
        <tr>
          <td style="background:${accentColor};height:4px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="padding:32px 32px 28px;color:${TXT_DARK};">
            ${innerHtml}
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:${SECTION_BG};border-top:1px solid ${SECTION_BORDER};padding:22px 32px;" align="center">
            <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:${TXT_MED};">Postura by Physio</p>
            <p style="margin:0 0 12px;font-size:12px;color:${TXT_LIGHT};">Vadodara, Gujarat, India</p>
            <p style="margin:0;font-size:11px;color:${TXT_LIGHT};">Questions? Reply to this email and we&rsquo;ll be happy to help.</p>
          </td>
        </tr>

      </table>
      <!-- /Email card -->

    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email builders ─────────────────────────────────────────────────────────────

/** Notification sent to the clinic / admin when a contact form is submitted. */
export function adminContactEmail(data: CreateContactInput) {
  const subject = `New contact message from ${data.fullName}`;

  const detailRows = [
    row("Name",             data.fullName),
    row("Phone",            data.phone),
    row("Email",            data.email),
    row("Service interest", data.service ?? null),
    row("Address",          data.address ?? null),
  ].join("");

  const html = shell(
    `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">New contact enquiry</h1>
    <p style="margin:0 0 4px;font-size:14px;color:${TXT_MED};line-height:1.7;">
      Someone just submitted the contact form on the website.
      Reply to this email to respond directly to them.
    </p>

    ${section("Contact details", detailRows)}
    ${data.message
      ? section("Message", `<tr><td colspan="2" style="padding:10px 0;font-size:14px;color:${TXT_DARK};line-height:1.7;">${esc(data.message)}</td></tr>`)
      : ""}

    <p style="margin:28px 0 0;font-size:12px;color:${TXT_LIGHT};">
      Received ${esc(new Date().toLocaleString("en-IN"))}
    </p>
    `,
    `New contact message from ${data.fullName}.`
  );

  const text =
    `New contact enquiry\n\n` +
    `Name:    ${data.fullName}\n` +
    `Phone:   ${data.phone}\n` +
    `Email:   ${data.email}\n` +
    (data.service ? `Service: ${data.service}\n` : "") +
    (data.address ? `Address: ${data.address}\n` : "") +
    (data.message ? `\nMessage:\n${data.message}\n` : "") +
    `\nReceived: ${new Date().toLocaleString("en-IN")}\n`;

  return { subject, html, text };
}

/** Confirmation sent to the person who submitted the contact form. */
export function customerContactEmail(data: CreateContactInput) {
  const firstName = data.fullName.split(/\s+/)[0] ?? data.fullName;
  const subject   = `We've received your message, ${firstName}`;

  const detailRows = [
    row("Name",             data.fullName),
    row("Phone",            data.phone),
    row("Email",            data.email),
    row("Service interest", data.service ?? null),
    row("Address",          data.address ?? null),
  ].join("");

  const html = shell(
    `
    ${banner("Message received — we'll be in touch soon", {
      bg: "#eff6ff", border: "#3b82f6", color: "#1d4ed8",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      Thanks, ${esc(firstName)} &mdash; we&rsquo;ll be in touch!
    </h1>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      We&rsquo;ve received your message and our team will get back to you shortly.
      Here&rsquo;s a copy of what you submitted for your records.
    </p>

    ${section("Your details", detailRows)}
    ${data.message
      ? section("Your message", `<tr><td colspan="2" style="padding:10px 0;font-size:14px;color:${TXT_DARK};line-height:1.7;">${esc(data.message)}</td></tr>`)
      : ""}

    <p style="margin:26px 0 0;font-size:13px;color:${TXT_LIGHT};line-height:1.6;">
      If anything looks incorrect, simply reply to this email and we&rsquo;ll sort it out.
    </p>
    `,
    `Your message has been received. We'll be in touch soon.`,
    "#3b82f6"
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Thanks for reaching out! We've received your message and will be in touch shortly.\n\n` +
    `Your details\n` +
    `  Name:    ${data.fullName}\n` +
    `  Phone:   ${data.phone}\n` +
    `  Email:   ${data.email}\n` +
    (data.service ? `  Service: ${data.service}\n` : "") +
    (data.address ? `  Address: ${data.address}\n` : "") +
    (data.message ? `\nYour message:\n  ${data.message}\n` : "") +
    `\n— Postura by Physio\n`;

  return { subject, html, text };
}
