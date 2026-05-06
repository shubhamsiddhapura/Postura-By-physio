import type { BookingDto } from "@repo/types";
import { BOOKING_PROGRAM_LABELS } from "@repo/types";
import { formatInZone, getClinicTimezone } from "@/lib/time/clinic";

// ── Brand palette ────────────────────────────────────────────────────────────
const BRAND          = "#008080";
const OUTER_BG       = "#f1f5f9";
const SECTION_BG     = "#f8fafc";
const SECTION_BORDER = "#e2e8f0";
const TXT_DARK       = "#1e293b";
const TXT_MED        = "#475569";
const TXT_LIGHT      = "#94a3b8";

// Logo URL must be absolute — email clients fetch it from their own network.
// NEXT_PUBLIC_API_BASE_URL resolves to the site root in production.
const _base   = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const LOGO_URL = _base ? `${_base}/admin-logo.png` : "";

// ── Timezone helpers ──────────────────────────────────────────────────────────
function patientDisplay(b: BookingDto): string {
  if (b.preferredDateTimeUtc && b.patientTimezone)
    return formatInZone(b.preferredDateTimeUtc, b.patientTimezone);
  return b.preferredDateTime;
}

function clinicDisplay(b: BookingDto): string {
  if (b.preferredDateTimeUtc)
    return formatInZone(b.preferredDateTimeUtc, getClinicTimezone());
  return b.preferredDateTime;
}

// ── HTML primitives ───────────────────────────────────────────────────────────
function esc(v: string | null | undefined): string {
  if (v == null) return "";
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One label / value pair inside a section card. */
function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
  <tr>
    <td style="padding:10px 16px 10px 0;font-size:11px;font-weight:700;color:${TXT_LIGHT};text-transform:uppercase;letter-spacing:.07em;vertical-align:top;white-space:nowrap;width:34%;">${esc(label)}</td>
    <td style="padding:10px 0;font-size:14px;color:${TXT_DARK};line-height:1.6;vertical-align:top;">${esc(value)}</td>
  </tr>`;
}

/** Section heading + rows wrapped in a light card. */
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

/**
 * Colored inline status banner — renders a tinted strip at the top of the
 * body for at-a-glance status recognition (green = confirmed, etc.).
 */
function banner(
  text: string,
  opts: { bg: string; border: string; color: string }
): string {
  return `
  <div style="background:${opts.bg};border-left:4px solid ${opts.border};border-radius:6px;padding:13px 16px;margin-bottom:24px;">
    <p style="margin:0;font-size:14px;font-weight:600;color:${opts.color};">${esc(text)}</p>
  </div>`;
}

/**
 * Full email chrome: teal logo header → coloured 4-px accent strip →
 * white body → grey footer.
 *
 * `accentColor` tints the strip just below the header logo bar so
 * recipients get an instant visual cue about the email type
 * (teal = default, blue = received, green = confirmed, etc.).
 */
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

  <!-- Preheader text (hidden, shows in inbox preview) -->
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

// ── Reusable row groups ───────────────────────────────────────────────────────
function bookingDetailsRows(b: BookingDto, displayTime: string, tzNote?: string): string {
  return [
    row("Program",      BOOKING_PROGRAM_LABELS[b.program]),
    row("Service",      b.service),
    row("Preferred",    tzNote ? `${displayTime} (${tzNote})` : displayTime),
    row("Consultation", b.consultationType),
    row("Pain area",    b.discomfortArea),
  ].join("");
}

function contactRows(b: BookingDto): string {
  return [
    row("Name",    b.fullName),
    row("Phone",   b.phone),
    row("Email",   b.email),
    row("Address", b.address),
  ].join("");
}

function questionnaireRows(b: BookingDto): string {
  return [
    row("Profile",        b.profileAbout),
    row("Activity level", b.activityLevel),
    row("Pain area",      b.discomfortArea),
    row("Possible cause", b.possibleCause),
  ].join("");
}

function firstNameOf(b: BookingDto): string {
  return b.fullName.split(/\s+/)[0] ?? b.fullName;
}

// ── Email builders ────────────────────────────────────────────────────────────

/**
 * Notification to the clinic / admin.
 * Uses clinic timezone; Reply-To is set to the customer so hitting reply
 * writes directly back to them.
 */
export function adminBookingEmail(b: BookingDto) {
  const subject  = `New booking: ${b.fullName} — ${BOOKING_PROGRAM_LABELS[b.program]}`;
  const adminTime   = clinicDisplay(b);
  const patientTime = patientDisplay(b);
  const showPatientRow =
    Boolean(b.patientTimezone) &&
    b.patientTimezone !== getClinicTimezone() &&
    adminTime !== patientTime;

  const appointmentRows = [
    row("Program",      BOOKING_PROGRAM_LABELS[b.program]),
    row("Service",      b.service),
    row("Clinic time",  `${adminTime} (${getClinicTimezone()})`),
    showPatientRow
      ? row("Patient time", `${patientTime} (${b.patientTimezone})`)
      : "",
    row("Consultation", b.consultationType),
    row("Pain area",    b.discomfortArea),
  ].join("");

  const html = shell(
    `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">New booking request</h1>
    <p style="margin:0 0 4px;font-size:14px;color:${TXT_MED};line-height:1.7;">
      A new appointment has just been requested via the website.
      Reply to this email to reach the patient directly.
    </p>

    ${section("Appointment", appointmentRows)}
    ${section("Patient contact", contactRows(b))}
    ${section("Questionnaire", questionnaireRows(b))}
    ${b.message ? section("Message", `<tr><td colspan="2" style="padding:10px 0;font-size:14px;color:${TXT_DARK};line-height:1.7;">${esc(b.message)}</td></tr>`) : ""}

    <p style="margin:28px 0 0;font-size:12px;color:${TXT_LIGHT};">
      Ref:&nbsp;<code style="background:${SECTION_BG};border:1px solid ${SECTION_BORDER};padding:2px 6px;border-radius:4px;font-size:11px;">${esc(b.id)}</code>
      &nbsp;&middot;&nbsp;Received ${esc(new Date(b.createdAt).toLocaleString("en-IN"))}
    </p>
    `,
    `New booking from ${b.fullName} for ${BOOKING_PROGRAM_LABELS[b.program]}.`
  );

  const text =
    `New booking request\n\n` +
    `Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `Service:     ${b.service}\n` : "") +
    `Clinic time: ${adminTime} (${getClinicTimezone()})\n` +
    (showPatientRow ? `Patient time: ${patientTime} (${b.patientTimezone})\n` : "") +
    (b.consultationType ? `Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `Pain area:    ${b.discomfortArea}\n` : "") +
    `\nName:  ${b.fullName}\n` +
    `Phone: ${b.phone}\n` +
    `Email: ${b.email}\n` +
    (b.address ? `Address: ${b.address}\n` : "") +
    (b.profileAbout
      ? `\nProfile: ${b.profileAbout}\n` +
        (b.activityLevel ? `Activity: ${b.activityLevel}\n` : "") +
        (b.discomfortArea ? `Discomfort: ${b.discomfortArea}\n` : "") +
        (b.possibleCause ? `Cause: ${b.possibleCause}\n` : "")
      : "") +
    (b.message ? `\nMessage:\n${b.message}\n` : "") +
    `\nRef: ${b.id}\n`;

  return { subject, html, text };
}

/** Confirmation email to the customer after they submit the booking form. */
export function customerBookingEmail(b: BookingDto) {
  const firstName = firstNameOf(b);
  const subject   = `We've received your booking request, ${firstName}`;
  const time      = patientDisplay(b);

  const html = shell(
    `
    ${banner("Booking request received — we'll confirm shortly", {
      bg: "#eff6ff", border: "#3b82f6", color: "#1d4ed8",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      Thanks, ${esc(firstName)} &mdash; we&rsquo;ve got it!
    </h1>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      Our team will reach out shortly to confirm your session.
      Here&rsquo;s a summary of the details you submitted for your records.
    </p>

    ${section("Your appointment", bookingDetailsRows(b, time, b.patientTimezone ?? undefined))}
    ${section("We'll contact you at", contactRows(b))}

    <p style="margin:26px 0 0;font-size:13px;color:${TXT_LIGHT};line-height:1.6;">
      If anything looks incorrect, simply reply to this email and we&rsquo;ll sort it out.
    </p>
    `,
    `Your booking for ${BOOKING_PROGRAM_LABELS[b.program]} has been received.`,
    "#3b82f6"
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Thanks — we've received your booking request. Our team will be in touch shortly to confirm.\n\n` +
    `Your appointment\n` +
    `  Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `  Service:     ${b.service}\n` : "") +
    `  Preferred:   ${time}${b.patientTimezone ? ` (${b.patientTimezone})` : ""}\n` +
    (b.consultationType ? `  Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `  Pain area:    ${b.discomfortArea}\n` : "") +
    `\nWe'll contact you at\n` +
    `  Phone: ${b.phone}\n` +
    `  Email: ${b.email}\n` +
    (b.address ? `  Address: ${b.address}\n` : "") +
    `\nReply to this email if any detail needs correcting.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}

/** Sent when the admin marks a booking `confirmed`. */
export function customerConfirmedEmail(b: BookingDto) {
  const firstName = firstNameOf(b);
  const time      = patientDisplay(b);
  const subject   = `Appointment confirmed — ${time}`;

  const html = shell(
    `
    ${banner("Your appointment is confirmed", {
      bg: "#f0fdf4", border: "#22c55e", color: "#15803d",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      See you soon, ${esc(firstName)}.
    </h1>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      Your appointment has been confirmed by our team. Please save the details below.
    </p>

    <!-- Prominent time display -->
    <div style="margin-top:24px;background:${SECTION_BG};border:1px solid ${SECTION_BORDER};border-radius:10px;padding:20px 24px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:${TXT_LIGHT};">Confirmed session</p>
      <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${TXT_DARK};">${esc(time)}</p>
      <p style="margin:0;font-size:13px;color:${TXT_MED};">${esc(BOOKING_PROGRAM_LABELS[b.program])}${b.service ? ` &mdash; ${esc(b.service)}` : ""}</p>
    </div>

    ${section("Full appointment details", bookingDetailsRows(b, time, b.patientTimezone ?? undefined))}
    ${section("We'll contact you at", contactRows(b))}

    <p style="margin:26px 0 0;font-size:13px;color:${TXT_LIGHT};line-height:1.6;">
      Need to make any changes? Just reply to this email and we&rsquo;ll sort it out.
    </p>
    `,
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} appointment has been confirmed.`,
    "#22c55e"
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your appointment has been confirmed.\n\n` +
    `  Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `  Service:     ${b.service}\n` : "") +
    `  Date & time: ${time}${b.patientTimezone ? ` (${b.patientTimezone})` : ""}\n` +
    (b.consultationType ? `  Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `  Pain area:    ${b.discomfortArea}\n` : "") +
    `\nReply to this email if you need to change anything.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}

/**
 * Sent when the admin changes a booking's time.
 * Both the previous and the new time are shown in the patient's own timezone.
 */
export function customerRescheduledEmail(before: BookingDto, after: BookingDto) {
  const firstName = firstNameOf(after);
  const tz        = after.patientTimezone ?? before.patientTimezone ?? null;

  const prevTime =
    before.preferredDateTimeUtc && tz
      ? formatInZone(before.preferredDateTimeUtc, tz)
      : before.preferredDateTime;
  const newTime =
    after.preferredDateTimeUtc && tz
      ? formatInZone(after.preferredDateTimeUtc, tz)
      : after.preferredDateTime;
  const tzSuffix = tz ? ` (${tz})` : "";
  const subject  = `Appointment rescheduled to ${newTime}`;

  const changeRows = `
  <tr>
    <td style="padding:10px 16px 10px 0;font-size:11px;font-weight:700;color:${TXT_LIGHT};text-transform:uppercase;letter-spacing:.07em;vertical-align:top;white-space:nowrap;width:34%;">Previously</td>
    <td style="padding:10px 0;font-size:14px;color:${TXT_LIGHT};line-height:1.6;vertical-align:top;text-decoration:line-through;">${esc(prevTime)}${esc(tzSuffix)}</td>
  </tr>
  <tr>
    <td style="padding:10px 16px 10px 0;font-size:11px;font-weight:700;color:${TXT_LIGHT};text-transform:uppercase;letter-spacing:.07em;vertical-align:top;white-space:nowrap;">New time</td>
    <td style="padding:10px 0;font-size:15px;font-weight:700;color:#b45309;line-height:1.6;vertical-align:top;">${esc(newTime)}${esc(tzSuffix)}</td>
  </tr>`;

  const html = shell(
    `
    ${banner("Your appointment has been rescheduled", {
      bg: "#fffbeb", border: "#f59e0b", color: "#92400e",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      Your session has moved, ${esc(firstName)}.
    </h1>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      As discussed, we&rsquo;ve updated your appointment to a new time slot. Please save the details below.
    </p>

    ${section("Schedule change", changeRows)}
    ${section("Appointment details", `${row("Program", BOOKING_PROGRAM_LABELS[after.program])}${row("Consultation", after.consultationType)}`)}

    <p style="margin:26px 0 0;font-size:13px;color:${TXT_LIGHT};line-height:1.6;">
      If the new time doesn&rsquo;t work, just reply to this email and we&rsquo;ll find another slot.
    </p>
    `,
    `Your appointment is now ${newTime}.`,
    "#f59e0b"
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your appointment has been rescheduled as discussed.\n\n` +
    `  Previously: ${prevTime}${tzSuffix}\n` +
    `  New time:   ${newTime}${tzSuffix}\n` +
    `  Program:    ${BOOKING_PROGRAM_LABELS[after.program]}\n` +
    (after.consultationType ? `  Consultation: ${after.consultationType}\n` : "") +
    `\nReply to this email if the new time doesn't work.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}

/** Sent when the admin marks a booking `cancelled`. */
export function customerCancelledEmail(b: BookingDto) {
  const firstName = firstNameOf(b);
  const time      = patientDisplay(b);
  const tzSuffix  = b.patientTimezone ? ` (${b.patientTimezone})` : "";
  const subject   = `Your appointment has been cancelled`;

  const html = shell(
    `
    ${banner("Your appointment has been cancelled", {
      bg: "#fef2f2", border: "#ef4444", color: "#991b1b",
    })}

    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:${TXT_DARK};line-height:1.3;">
      Appointment cancelled, ${esc(firstName)}.
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TXT_MED};line-height:1.7;">
      This is a confirmation that your <strong>${esc(BOOKING_PROGRAM_LABELS[b.program])}</strong> session
      scheduled for <strong>${esc(time)}${esc(tzSuffix)}</strong> has been cancelled.
    </p>
    <p style="margin:0;font-size:14px;color:${TXT_MED};line-height:1.7;">
      Would you like to reschedule? Simply reply to this email with a time that works
      for you and we&rsquo;ll get a new slot booked for you right away.
    </p>
    `,
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} appointment has been cancelled.`,
    "#ef4444"
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} session for ${time}${tzSuffix} has been cancelled.\n\n` +
    `Want to reschedule? Just reply with a time that works and we'll book it in.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}
