const Booking = require("../models/Booking");

const PRICES = {
  call: 2000,
  physical: 5000,
};

// Normalises the many ways Pakistani numbers get typed (+92, 0092, 0317...)
// down to one comparable form so the admin panel doesn't show duplicates.
function normalisePhone(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("92")) return "0" + digits.slice(2);
  if (digits.startsWith("0")) return digits;
  return "0" + digits;
}

// POST /api/bookings  (multipart/form-data, field name "screenshot")
// Called after the customer has picked a Calendly slot and sent payment.
async function createBooking(req, res) {
  try {
    const {
      serviceType,
      customerName,
      customerPhone,
      slotTime,
      calendlyEventUri,
      paymentMethod,
      accountTitle,
      transactionId,
    } = req.body;

    if (!serviceType || !PRICES[serviceType]) {
      return res.status(400).json({ error: "Service type ghalat hai." });
    }
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: "Naam aur phone number zaroori hain." });
    }
    if (!accountTitle || !transactionId) {
      return res
        .status(400)
        .json({ error: "Payment ki tamam details bharna zaroori hai." });
    }
    // Card (bank transfer) is the only method on offer; anything else is a
    // stale client or a hand-crafted request.
    if (paymentMethod && paymentMethod !== "card") {
      return res
        .status(400)
        .json({ error: "Sirf card se adaigi qabool ki jati hai." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot lazmi hai." });
    }

    const cleanTid = String(transactionId).trim().toUpperCase();

    // The same payment receipt must not be reusable for a second booking.
    const alreadyUsed = await Booking.findOne({ transactionId: cleanTid });
    if (alreadyUsed) {
      return res.status(409).json({
        error:
          "Yeh transaction ID pehle se istemal ho chuki hai. Har booking ke liye alag ادائیگی zaroori hai.",
      });
    }

    const booking = await Booking.create({
      serviceType,
      amount: PRICES[serviceType],
      customerName: String(customerName).trim(),
      customerPhone: normalisePhone(customerPhone),
      slotTime: slotTime ? new Date(slotTime) : undefined,
      calendlyEventUri,
      paymentMethod: "card",
      accountTitle: String(accountTitle).trim(),
      transactionId: cleanTid,
      screenshotUrl: req.file.path, // Cloudinary URL
      status: "pending",
    });

    return res.status(201).json({
      message:
        "Booking request bhej di gayi hai. Tasdeeq ke baad aap ko WhatsApp par confirmation milegi.",
      bookingId: booking._id,
    });
  } catch (err) {
    // Mongo duplicate-key error, in case two requests race past the check above
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Yeh transaction ID pehle se istemal ho chuki hai." });
    }
    console.error(err);
    return res.status(500).json({ error: "Kuch masla ho gaya, dobara koshish karein." });
  }
}

module.exports = { createBooking, PRICES };
