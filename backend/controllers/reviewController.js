const { sendReviewEmail, isConfigured } = require("../utils/mailer");

const SERVICES = {
  call: "Initial Consultation",
  physical: "In-Person Session",
};

function fallbackContact() {
  return process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_TO_EMAIL || "";
}

// POST /api/reviews
async function submitReview(req, res) {
  const { name, city, service, rating, review, consent, contact, website } =
    req.body || {};

  if (website) return res.status(200).json({ message: "Shukriya." });

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: "Apna naam likhein." });
  }
  if (!SERVICES[service]) {
    return res.status(400).json({ error: "Service muntakhib karein." });
  }
  const stars = Number(rating);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({ error: "1 se 5 ke darmiyan rating dein." });
  }
  if (!review || String(review).trim().length < 15) {
    return res.status(400).json({ error: "Apna tassur thora tafseel se likhein." });
  }
  if (String(review).length > 2000) {
    return res.status(400).json({ error: "Tassur bohat lamba hai." });
  }
  // Nothing is published without this. A review submitted without explicit
  // permission is not usable, so it is rejected rather than quietly stored.
  if (consent !== true && consent !== "true" && consent !== "on") {
    return res.status(400).json({
      error: "Shaya karne ki ijazat dena zaroori hai.",
      code: "CONSENT_REQUIRED",
    });
  }

  if (!isConfigured()) {
    const to = fallbackContact();
    return res.status(503).json({
      code: "SMTP_NOT_CONFIGURED",
      contactEmail: to,
      error: to
        ? `Form abhi kaam nahi kar raha. Baraye meharbani apna tassur seedha email karein: ${to}`
        : "Form abhi kaam nahi kar raha. Thori dair baad dobara koshish karein.",
    });
  }

  try {
    await sendReviewEmail({
      name: String(name).trim(),
      city: city ? String(city).trim() : "",
      service: SERVICES[service],
      rating: stars,
      review: String(review).trim(),
      consent: true,
      contact: contact ? String(contact).trim() : "",
    });
    return res.status(200).json({ message: "Shukriya. Aap ka tassur mil gaya hai." });
  } catch (err) {
    console.error("Review email failed:", err.message);
    const to = fallbackContact();
    return res.status(502).json({
      code: "SEND_FAILED",
      contactEmail: to,
      error: to
        ? `Bhejne mein masla hua. Baraye meharbani seedha email karein: ${to}`
        : "Bhejne mein masla hua. Thori dair baad dobara koshish karein.",
    });
  }
}

module.exports = { submitReview };
