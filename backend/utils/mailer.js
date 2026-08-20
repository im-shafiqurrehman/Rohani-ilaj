const nodemailer = require("nodemailer");
const { formatSlotRange } = require("./datetime");

let transporter = null;

function isConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO_EMAIL
  );
}

function getTransporter() {
  if (!isConfigured()) return null;
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT || 587);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendContactEmail({ name, phone, email, topic, message }) {
  const tx = getTransporter();
  if (!tx) {
    const err = new Error("SMTP is not configured");
    err.code = "SMTP_NOT_CONFIGURED";
    throw err;
  }

  const rows = [
    ["Naam", name],
    ["WhatsApp / Phone", phone],
    ["Email", email || "—"],
    ["Mauzoo (topic)", topic],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nPaigham:\n${message}\n`;

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#051740;max-width:560px">
      <h2 style="margin:0 0 4px;color:#051740">Rohani Ilaj Center website form</h2>
      <p style="margin:0 0 16px;color:#8A6413;font-size:13px">
        Yeh paigham website ke contact form se aaya hai.
      </p>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="border:1px solid #E6BD60;background:#FDF7EA;font-weight:600;white-space:nowrap">${k}</td>
                 <td style="border:1px solid #E6BD60">${escapeHtml(String(v))}</td>
               </tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 6px;font-size:14px">Paigham</h3>
      <p style="white-space:pre-wrap;font-size:14px;line-height:1.7;border-right:3px solid #E6BD60;padding-right:12px;margin:0">${escapeHtml(
        message
      )}</p>
    </div>
  `;

  return tx.sendMail({
    // Must be an address the SMTP account may send as; visitor goes in replyTo.
    // visitor's own address goes in replyTo instead of from.
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email || undefined,
    subject: `[${topic}] ${name} (${phone})`,
    text,
    html,
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendBookingDecisionEmail(booking, { contactNumber } = {}) {
  if (!booking.customerEmail) return { sent: false, reason: "no-email" };

  const tx = getTransporter();
  if (!tx) return { sent: false, reason: "smtp-not-configured" };

  const approved = booking.status === "approved";
  const slot = formatSlotRange(booking.slotTime, booking.slotEndTime);

  const rows = [
    ["Service", booking.serviceType === "call" ? "Initial consultation" : "In-person session"],
    ["Amount", `Rs ${Number(booking.amount || 0).toLocaleString()}`],
    slot ? ["Your slot", slot] : null,
    booking.slotReference ? ["Slot reference", booking.slotReference] : null,
    approved && contactNumber ? ["Contact number", contactNumber] : null,
    // Deliberately no meeting link: Calendly already emails its own
    booking.adminNote ? ["Note", booking.adminNote] : null,
  ].filter(Boolean);

  const heading = approved
    ? "Aap ki booking confirm ho gayi hai"
    : "Aap ki booking manzoor nahi ho saki";

  const text =
    `${heading}\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nRohani Ilaj Center\n`;

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0B1B2B;max-width:560px">
      <h2 style="margin:0 0 6px">${heading}</h2>
      <p style="margin:0 0 18px;color:#4A6076;font-size:13px">Rohani Ilaj Center</p>
      <table cellpadding="8" style="border-collapse:collapse;font-size:14px;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="border:1px solid #D3E1ED;background:#F6F9FC;font-weight:600;white-space:nowrap">${escapeHtml(k)}</td>
                 <td style="border:1px solid #D3E1ED">${escapeHtml(String(v))}</td>
               </tr>`
          )
          .join("")}
      </table>
      ${
        approved
          ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.7">Muqarrara waqt par raabta karein. Shukriya.</p>`
          : `<p style="margin:18px 0 0;font-size:14px;line-height:1.7">Agar aap ko lagta hai ke yeh ghalti se hua hai, to baraye meharbani hum se raabta karein.</p>`
      }
    </div>
  `;

  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.customerEmail,
      subject: approved
        ? "Booking confirmed | Rohani Ilaj Center"
        : "Booking update | Rohani Ilaj Center",
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("Decision email failed:", err.message);
    return { sent: false, reason: err.message };
  }
}

/** Shared table + wrapper so every booking email looks the same. */
function bookingHtml(heading, subheading, rows, footer) {
  return `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0B1B2B;max-width:560px">
      <h2 style="margin:0 0 6px">${escapeHtml(heading)}</h2>
      <p style="margin:0 0 18px;color:#4A6076;font-size:13px">${escapeHtml(subheading)}</p>
      <table cellpadding="8" style="border-collapse:collapse;font-size:14px;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="border:1px solid #D3E1ED;background:#F6F9FC;font-weight:600;white-space:nowrap">${escapeHtml(k)}</td>
                 <td style="border:1px solid #D3E1ED">${escapeHtml(String(v))}</td>
               </tr>`
          )
          .join("")}
      </table>
      ${footer ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.7">${escapeHtml(footer)}</p>` : ""}
    </div>`;
}

function bookingRows(booking) {
  return [
    ["Service", booking.serviceType === "call" ? "Initial consultation" : "In-person session"],
    ["Amount", `Rs ${Number(booking.amount || 0).toLocaleString()}`],
    booking.slotTime
      ? ["Slot", formatSlotRange(booking.slotTime, booking.slotEndTime)]
      : null,
    booking.slotReference ? ["Slot reference", booking.slotReference] : null,
  ].filter(Boolean);
}

async function sendBookingReceivedEmail(booking) {
  if (!booking.customerEmail) return { sent: false, reason: "no-email" };
  const tx = getTransporter();
  if (!tx) return { sent: false, reason: "smtp-not-configured" };

  const rows = bookingRows(booking);
  const footer =
    "Aap ki receipt ki tasdeeq ki ja rahi hai. Tasdeeq ke baad aap ko raabta number aur nishist ki tafseelat bhej di jayengi.";

  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.customerEmail,
      subject: "Booking received | Rohani Ilaj Center",
      text:
        `Aap ki booking mil gayi hai\n\n` +
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\n\n${footer}\n`,
      html: bookingHtml(
        "Aap ki booking mil gayi hai",
        "Rohani Ilaj Center",
        rows,
        footer
      ),
    });
    return { sent: true };
  } catch (err) {
    console.error("Booking-received email failed:", err.message);
    return { sent: false, reason: err.message };
  }
}

async function sendNewBookingAlert(booking) {
  const tx = getTransporter();
  if (!tx || !process.env.CONTACT_TO_EMAIL) {
    return { sent: false, reason: "smtp-not-configured" };
  }

  const rows = [
    ["Name", booking.customerName],
    ["Phone", booking.customerPhone],
    booking.customerEmail ? ["Email", booking.customerEmail] : null,
    ...bookingRows(booking),
    booking.paidByThirdParty ? ["Paid by (third party)", booking.accountTitle] : null,
  ].filter(Boolean);

  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: booking.customerEmail || undefined,
      subject: `New booking: ${booking.customerName} (${booking.slotReference || "no ref"})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: bookingHtml(
        "New booking awaiting approval",
        "Open the admin panel to review the receipt.",
        rows,
        ""
      ),
    });
    return { sent: true };
  } catch (err) {
    console.error("New-booking alert failed:", err.message);
    return { sent: false, reason: err.message };
  }
}

async function verifyConnection() {
  const tx = getTransporter();
  if (!tx) return { ok: false, reason: "SMTP is not configured" };
  try {
    await tx.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

module.exports = {
  verifyConnection,
  sendContactEmail,
  sendBookingDecisionEmail,
  sendBookingReceivedEmail,
  sendNewBookingAlert,
  isConfigured,
};
