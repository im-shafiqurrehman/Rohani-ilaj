const nodemailer = require("nodemailer");

/*
 * Outbound mail for the public contact form.
 *
 * Kept behind a lazy singleton so the server still boots (and bookings still
 * work) when SMTP hasn't been configured yet — only the contact endpoint
 * degrades, and it says so plainly instead of throwing at startup.
 */

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
      <h2 style="margin:0 0 4px;color:#051740">Rohani Illaj — website form</h2>
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
    // Must be an address the SMTP account is allowed to send as, so the
    // visitor's own address goes in replyTo instead of from.
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email || undefined,
    subject: `[${topic}] ${name} — ${phone}`,
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

module.exports = { sendContactEmail, isConfigured };
