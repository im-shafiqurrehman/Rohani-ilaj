const Booking = require("../models/Booking");
const { normalisePhone } = require("../utils/phone");
const { fetchScheduledEvent, slotReference } = require("../utils/calendly");
const { sendNewBookingAlert } = require("../utils/mailer");

const PRICES = {
  call: 2000,
  physical: 5000,
};

// POST /api/bookings  (multipart/form-data, field name "screenshot")
// Called after the customer has picked a Calendly slot and sent payment.
async function createBooking(req, res) {
  try {
    const {
      serviceType,
      customerName,
      customerPhone,
      customerEmail,
      slotTime,
      calendlyEventUri,
      paymentMethod,
      accountTitle,
      paidByThirdParty,
    } = req.body;

    if (!serviceType || !PRICES[serviceType]) {
      return res.status(400).json({ error: "Service type ghalat hai." });
    }
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: "Naam aur phone number zaroori hain." });
    }
    // A `required` attribute in the browser is trivially bypassed, so the
    // real gate is here — without a deliverable address the confirmation and
    // the post-approval contact number have nowhere to go.
    const email = String(customerEmail || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ error: "Durust email address likhna zaroori hai." });
    }
    // Card (bank transfer) is the only method on offer; anything else is a
    // stale client or a hand-crafted request.
    if (paymentMethod && paymentMethod !== "card") {
      return res
        .status(400)
        .json({ error: "Sirf card se adaigi qabool ki jati hai." });
    }
    // The screenshot is the only proof of payment now, so it is the one
    // thing that must be present.
    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot lazmi hai." });
    }

    // Cloudinary reports an MD5 of the stored file as `etag`. When the storage
    // driver surfaces it, use it to stop the exact same receipt image being
    // submitted for two different bookings — the job the transaction ID used
    // to do. Different receipts for the same amount hash differently, so this
    // only catches a literal re-upload.
    const etag = req.file.etag || null;
    if (etag) {
      const reused = await Booking.findOne({ screenshotEtag: etag });
      if (reused) {
        return res.status(409).json({
          error:
            "Yeh screenshot pehle se istemal ho chuki hai. Har booking ke liye alag adaigi zaroori hai.",
        });
      }
    }

    // Third-party payments are the one case where the name on the sending
    // account genuinely can't be inferred, so it is required then and only then.
    const thirdParty =
      paidByThirdParty === true ||
      paidByThirdParty === "true" ||
      paidByThirdParty === "on";

    if (thirdParty && (!accountTitle || String(accountTitle).trim().length < 3)) {
      return res.status(400).json({
        error: "Jis ke account se adaigi ki gayi hai, un ka naam likhein.",
      });
    }

    // Resolve the actual booked slot. Never fatal — a failed lookup leaves the
    // slot fields empty and the admin can still work from the receipt.
    // serviceType selects which Calendly account's token to use.
    const slot = await fetchScheduledEvent(calendlyEventUri, serviceType);

    const booking = await Booking.create({
      serviceType,
      amount: PRICES[serviceType],
      customerName: String(customerName).trim(),
      customerPhone: normalisePhone(customerPhone),
      customerEmail: email,
      slotTime: slot?.startTime || (slotTime ? new Date(slotTime) : undefined),
      slotEndTime: slot?.endTime,
      slotReference: slotReference(calendlyEventUri),
      calendlyEventName: slot?.eventName,
      calendlyEventUri,
      // Calendly generates the meeting link itself, so pre-fill it rather than
      // making the ustad create and paste one at approval time.
      meetLink: slot?.joinUrl || undefined,
      accountTitle: thirdParty ? String(accountTitle).trim() : undefined,
      paidByThirdParty: thirdParty,
      // optionalUser middleware sets req.user only when a valid customer
      // token was sent; guests simply don't get a link.
      user: req.user ? req.user.id : undefined,
      paymentMethod: "card",
      screenshotUrl: req.file.path, // Cloudinary URL
      screenshotEtag: etag || undefined,
      status: "pending",
    });

    // The CUSTOMER gets exactly one email, and only once the payment has been
    // approved (see adminController). No acknowledgement is sent at submission
    // time — the on-screen confirmation already covers that, and a second
    // message before anything is decided is just noise.
    //
    // This alert goes to the practitioner, not the customer, so that a booking
    // waiting for review doesn't depend on someone remembering to open the
    // dashboard. Set NOTIFY_ADMIN_ON_BOOKING=false to switch it off.
    if (process.env.NOTIFY_ADMIN_ON_BOOKING !== "false") {
      // Fired, not awaited: an SMTP round trip is 1-2s and the customer should
      // not wait on it. A booking must never fail because email did.
      sendNewBookingAlert(booking).catch(() => {});
    }

    return res.status(201).json({
      message:
        "Booking request bhej di gayi hai. Tasdeeq ke baad aap ko raabta number aur tafseelat bhej di jayengi.",
      bookingId: booking._id,
    });
  } catch (err) {
    // Mongo duplicate-key error, in case two requests race past the check above
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Yeh screenshot pehle se istemal ho chuki hai." });
    }
    console.error(err);
    return res.status(500).json({ error: "Kuch masla ho gaya, dobara koshish karein." });
  }
}

module.exports = { createBooking, PRICES };
