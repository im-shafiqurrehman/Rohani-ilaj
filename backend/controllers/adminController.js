const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Booking = require("../models/Booking");
const { normalisePhone } = require("../utils/phone");
const { sendBookingDecisionEmail } = require("../utils/mailer");
const { PRICES } = require("./bookingController");
const crypto = require("crypto");

// POST /api/admin/login   body: { phone, password }
async function login(req, res) {
  const { phone, password } = req.body || {};
  const normalised = normalisePhone(phone);

  const user = normalised ? await User.findOne({ phone: normalised }) : null;
  const invalid = { error: "Ghalat phone number ya password." };
  if (!user) return res.status(401).json(invalid);

  const valid = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!valid) return res.status(401).json(invalid);

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Is account ko admin access nahi hai." });
  }

  const token = jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });
}

// GET /api/admin/bookings?status=pending&q=searchterm
async function listBookings(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  // Lets the admin find a booking by name, phone, or transaction ID when a
  // customer messages asking "meri booking kahan hai?"
  if (req.query.q) {
    const term = String(req.query.q).trim();
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    // transactionId / accountTitle are no longer collected, but older
    filter.$or = [
      { customerName: rx },
      { customerPhone: rx },
      { slotReference: rx },
      { accountTitle: rx },
      // Collected by the older form only, but kept searchable so a customer
      // quoting an old reference can still be found.
      { transactionId: rx },
    ];
  }

  // Paginated. The old flat .limit(200) silently hid everything older than
  // the 200th booking, with nothing on screen to say so.
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 100);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);

  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);

  return res.json({ items, total, skip, limit });
}

// GET /api/admin/stats - small counts for the dashboard header
async function getStats(req, res) {
  const [pending, approved, rejected, revenueAgg] = await Promise.all([
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "approved" }),
    Booking.countDocuments({ status: "rejected" }),
    Booking.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return res.json({
    pending,
    approved,
    rejected,
    approvedRevenue: revenueAgg[0]?.total || 0,
  });
}

// PATCH /api/admin/bookings/:id   body: { status, adminNote?, meetLink? }
async function updateBookingStatus(req, res) {
  const { status, adminNote, meetLink } = req.body;

  // "pending" is allowed so a mis-click can be undone. Before this, one wrong
  // tap was permanent and the customer had already been told the outcome.
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status approved, rejected ya pending ho sakta hai." });
  }

  // A rejection the customer can't understand turns into a phone call, and
  // they have already paid by this point — so a reason is required.
  if (status === "rejected" && (!adminNote || String(adminNote).trim().length < 5)) {
    return res
      .status(400)
      .json({ error: "Rejection ki wajah likhna zaroori hai." });
  }

  const update = { status, meetLink };
  // Reverting to pending clears the previous decision's note so a stale
  // rejection reason doesn't linger on a booking that is open again.
  update.adminNote = status === "pending" ? "" : adminNote;

  // Read the current status first so we only notify on an actual CHANGE.
  const before = await Booking.findById(req.params.id).select("status").lean();
  if (!before) {
    return res.status(404).json({ error: "Booking nahi mili." });
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking nahi mili." });
  }

  const statusChanged = before.status !== status;

  // Notify the customer. Deliberately awaited but never allowed to fail the
  let notified = { sent: false, reason: "unchanged" };
  if (status !== "pending" && statusChanged) {
    notified = await sendBookingDecisionEmail(booking, {
      contactNumber: process.env.SESSION_CONTACT_NUMBER || "",
    });
  }

  return res.json({ ...booking.toObject(), notified });
}

// POST /api/admin/bookings
//
// The practitioner entering a booking taken over WhatsApp. Some customers are
// not comfortable with the online flow: they send a receipt on WhatsApp and
// the booking is recorded here instead. No screenshot is needed because the
// receipt has already been seen, so these are created already approved.
async function createBookingAsAdmin(req, res) {
  const {
    serviceType,
    customerName,
    customerPhone,
    customerEmail,
    slotTime,
    amount,
    adminNote,
    meetLink,
  } = req.body || {};

  if (!serviceType || !PRICES[serviceType]) {
    return res.status(400).json({ error: "Service type ghalat hai." });
  }
  if (!customerName || String(customerName).trim().length < 3) {
    return res.status(400).json({ error: "Customer ka poora naam likhein." });
  }
  const phone = normalisePhone(customerPhone);
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: "Durust phone number likhein." });
  }
  const email = String(customerEmail || "").trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email address durust nahi hai." });
  }

  let slot;
  if (slotTime) {
    slot = new Date(slotTime);
    if (Number.isNaN(slot.getTime())) {
      return res.status(400).json({ error: "Slot ka waqt durust nahi hai." });
    }
  }

  // These have no Calendly event, so mint a reference the customer can quote.
  const slotReference = crypto.randomBytes(4).toString("hex").toUpperCase();

  const booking = await Booking.create({
    serviceType,
    amount: Number(amount) > 0 ? Number(amount) : PRICES[serviceType],
    customerName: String(customerName).trim(),
    customerPhone: phone,
    customerEmail: email || undefined,
    slotTime: slot,
    slotReference,
    paymentMethod: "card",
    createdByAdmin: true,
    status: "approved",
    adminNote: adminNote ? String(adminNote).trim() : undefined,
    meetLink: meetLink ? String(meetLink).trim() : undefined,
  });

  // Only reaches them if an email was supplied; otherwise the practitioner
  // tells them on WhatsApp, which is how the booking arrived in the first place.
  let notified = { sent: false, reason: "no-email" };
  if (email) {
    notified = await sendBookingDecisionEmail(booking, {
      contactNumber: process.env.SESSION_CONTACT_NUMBER || "",
    });
  }

  return res.status(201).json({ ...booking.toObject(), notified });
}

module.exports = {
  login,
  listBookings,
  updateBookingStatus,
  getStats,
  createBookingAsAdmin,
};
