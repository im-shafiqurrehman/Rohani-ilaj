#!/usr/bin/env node
/*
 * Email smoke test:  npm run test:email  [recipient@example.com]
 *
 * Runs the three stages separately so a failure tells you WHICH thing is
 * wrong — missing config, bad credentials, or a broken template — rather than
 * one opaque "email didn't work".
 */
require("dotenv").config();
const { verifyConnection, sendBookingDecisionEmail, isConfigured } = require("../utils/mailer");

const REQUIRED = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO_EMAIL"];

(async () => {
  console.log("\n1. Configuration");
  let missing = [];
  for (const k of REQUIRED) {
    const ok = Boolean(process.env[k]);
    if (!ok) missing.push(k);
    console.log(`   ${ok ? "OK  " : "MISSING"}  ${k}`);
  }

  // Gmail App Passwords are the single most common setup failure: Google
  // DISPLAYS them as "xxxx xxxx xxxx xxxx", and pasting that verbatim (or
  // dropping a character while selecting it) produces an opaque 535 error.
  // Check the shape locally so the problem is named, not guessed at.
  if (/gmail|google/i.test(process.env.SMTP_HOST || "")) {
    const raw = process.env.SMTP_PASS || "";
    const stripped = raw.replace(/\s/g, "");
    if (raw && /\s/.test(raw)) {
      console.log("   note    SMTP_PASS contains spaces. Google tolerates these,");
      console.log("           so this is fine — they are display formatting only.");
    }
    if (stripped && stripped.length !== 16) {
      const groups = raw.trim().split(/\s+/).map((g) => g.length).join(" + ");
      console.error(
        `\n   SMTP_PASS is ${stripped.length} characters (expected 16).` +
          `\n   Group sizes: ${groups}  — a full App Password is 4 + 4 + 4 + 4.` +
          `\n   A character was lost while copying. Re-copy it, or generate a new` +
          `\n   one at myaccount.google.com/apppasswords, and paste WITHOUT spaces.\n`
      );
      process.exit(1);
    }
  }

  if (!isConfigured()) {
    console.error(
      `\n   Not configured. Fill these in backend/.env: ${missing.join(", ")}` +
        `\n   Gmail needs an App Password (myaccount.google.com/apppasswords),` +
        `\n   not your normal password.\n`
    );
    process.exit(1);
  }

  const host = (process.env.SMTP_HOST || "").toLowerCase();
  const PROVIDER = host.includes("mailjet")
    ? "Mailjet — SMTP_USER is the API Key, SMTP_PASS is the Secret Key"
    : host.includes("elasticemail")
    ? "Elastic Email — SMTP_USER is your account email, SMTP_PASS is the API key"
    : host.includes("smtp2go")
    ? "SMTP2GO — credentials come from Sending > SMTP Users, not your login"
    : host.includes("gmail")
    ? "Gmail — SMTP_PASS must be a 16-character App Password"
    : null;
  if (PROVIDER) console.log(`   note    ${PROVIDER}`);

  console.log("\n2. Connection + login");
  const conn = await verifyConnection();
  if (!conn.ok) {
    console.error(`   FAILED: ${conn.reason}`);
    if (host.includes("gmail")) {
      console.error(
        "\n   'Invalid login' on Gmail almost always means a normal password was" +
          "\n   used instead of a 16-character App Password.\n"
      );
    } else if (PROVIDER) {
      console.error(`\n   Check the credential pairing: ${PROVIDER}\n`);
    }
    process.exit(1);
  }
  console.log("   OK    authenticated with " + process.env.SMTP_HOST);

  const to = process.argv[2] || process.env.CONTACT_TO_EMAIL;
  console.log(`\n3. Sending a sample APPROVAL email to ${to}`);
  const res = await sendBookingDecisionEmail(
    {
      customerEmail: to,
      customerName: "Test Customer",
      serviceType: "call",
      amount: 2000,
      status: "approved",
      slotTime: new Date(Date.now() + 86400000),
      slotEndTime: new Date(Date.now() + 86400000 + 30 * 60000),
      slotReference: "TEST1234",
      meetLink: "https://meet.google.com/test-link",
    },
    { contactNumber: process.env.SESSION_CONTACT_NUMBER || "" }
  );

  if (!res.sent) {
    console.error(`   FAILED: ${res.reason}\n`);
    process.exit(1);
  }
  console.log("   OK    sent — check that inbox (and the spam folder)\n");
})();
