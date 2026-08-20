const { sendContactEmail, isConfigured } = require("../utils/mailer");

// The topics the public form offers. Anything else is rejected so the email
// subject line can't be set to arbitrary text by a caller.
const TOPICS = {
  sawal: "Sawal / General question",
  booking: "Booking mein madad",
  tassur: "Tassur / Review",
  deegar: "Deegar",
};

/** The site publishes no phone number until a payment is approved, so the
 *  only honest fallback when the form itself is down is the public email. */
function fallbackContact() {
  return process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_TO_EMAIL || "";
}

// POST /api/contact   body: { name, phone, email?, topic, message, website? }
async function submitContact(req, res) {
  const { name, phone, email, topic, message, website } = req.body || {};

  // Honeypot: a real person never fills a field they can't see.
  if (website) {
    return res.status(200).json({ message: "Paigham bhej diya gaya hai." });
  }

  if (!name || String(name).trim().length < 3) {
    return res.status(400).json({ error: "Poora naam likhein." });
  }
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 10) {
    return res.status(400).json({ error: "Durust phone number likhein." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return res.status(400).json({ error: "Email address durust nahi hai." });
  }
  if (!TOPICS[topic]) {
    return res.status(400).json({ error: "Mauzoo muntakhib karein." });
  }
  if (!message || String(message).trim().length < 10) {
    return res.status(400).json({ error: "Paigham thora tafseel se likhein." });
  }
  if (String(message).length > 4000) {
    return res.status(400).json({ error: "Paigham bohat lamba hai." });
  }

  if (!isConfigured()) {
    console.error(
      "Contact form submitted but SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO_EMAIL in backend/.env"
    );
    const to = fallbackContact();
    // A `code` travels with the message so the bilingual frontend can render
    // this in the reader's own language instead of always in Roman Urdu.
    return res.status(503).json({
      code: "SMTP_NOT_CONFIGURED",
      contactEmail: to,
      error: to
        ? `Form abhi kaam nahi kar raha. Baraye meharbani hamein seedha email karein: ${to}`
        : "Form abhi kaam nahi kar raha. Baraye meharbani thori dair baad dobara koshish karein.",
    });
  }

  try {
    await sendContactEmail({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      topic: TOPICS[topic],
      message: String(message).trim(),
    });
    return res.status(200).json({ message: "Paigham bhej diya gaya hai." });
  } catch (err) {
    console.error("Contact email failed:", err.message);
    const to = fallbackContact();
    return res.status(502).json({
      code: "SEND_FAILED",
      contactEmail: to,
      error: to
        ? `Paigham bhejne mein masla hua. Baraye meharbani hamein seedha email karein: ${to}`
        : "Paigham bhejne mein masla hua. Baraye meharbani thori dair baad dobara koshish karein.",
    });
  }
}

module.exports = { submitContact, TOPICS };
