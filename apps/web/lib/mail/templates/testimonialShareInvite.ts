// ── Brand palette (aligned with contact/booking templates) ────────────────────
const BRAND          = "#008080";
const OUTER_BG       = "#f1f5f9";
const SECTION_BG     = "#f8fafc";
const SECTION_BORDER = "#e2e8f0";
const TXT_DARK       = "#1e293b";
const TXT_MED        = "#475569";
const TXT_LIGHT      = "#94a3b8";

const _base    = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const LOGO_URL = _base ? `${_base}/admin-logo.png` : "";

function esc(v: string | null | undefined): string {
  if (v == null) return "";
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape a validated URL for use inside double-quoted HTML attributes. */
function hrefEsc(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
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

  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:${OUTER_BG};">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${OUTER_BG};padding:40px 16px;">
    <tr><td align="center">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.09);">

        <tr>
          <td style="background:${BRAND};padding:22px 32px;" align="left">
            ${logoImg}
          </td>
        </tr>

        <tr>
          <td style="background:${accentColor};height:4px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <tr>
          <td style="padding:32px 32px 28px;color:${TXT_DARK};">
            ${innerHtml}
          </td>
        </tr>

        <tr>
          <td style="background:${SECTION_BG};border-top:1px solid ${SECTION_BORDER};padding:22px 32px;" align="center">
            <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:${TXT_MED};">Postura by Physio</p>
            <p style="margin:0 0 12px;font-size:12px;color:${TXT_LIGHT};">Vadodara, Gujarat, India</p>
            <p style="margin:0;font-size:11px;color:${TXT_LIGHT};">Questions? Reply to this email and we&rsquo;ll be happy to help.</p>
          </td>
        </tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

export function testimonialShareInviteEmail(opts: { formUrl: string }) {
  const { formUrl } = opts;
  const subject = "Share your experience with Postura by Physio";
  const preheader = "We'd love to hear your story — open the link to submit your testimonial.";

  const ctaRow = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
    <tr>
      <td align="center" style="border-radius:8px;background:${BRAND};">
        <a href="${hrefEsc(formUrl)}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
          Share your story
        </a>
      </td>
    </tr>
  </table>`;

  const html = shell(
    `
    ${banner("You're invited to share your feedback", {
      bg: "#ecfdf5", border: "#059669", color: "#047857",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      Tell us how your recovery went
    </h1>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      Your words help others take the first step toward better movement and posture.
      Use the secure link below to submit a short testimonial (and optional photos or video) in your own time.
    </p>

    ${ctaRow}

    <p style="margin:24px 0 0;font-size:13px;color:${TXT_LIGHT};line-height:1.6;">
      If the button doesn&rsquo;t work, copy and paste this address into your browser:<br/>
      <span style="word-break:break-all;color:${TXT_MED};">${esc(formUrl)}</span>
    </p>
    `,
    preheader,
    "#059669"
  );

  const text =
    `Hi,\n\n` +
    `We'd love to hear about your experience with Postura by Physio.\n` +
    `Share your story using this link:\n\n` +
    `${formUrl}\n\n` +
    `Thank you,\n` +
    `Postura by Physio\n`;

  return { subject, html, text };
}
