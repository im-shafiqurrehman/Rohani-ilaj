const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");

// POST /api/admin/login
async function login(req, res) {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({ error: "Ghalat username ya password." });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Ghalat username ya password." });
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({ token });
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
    filter.$or = [
      { customerName: rx },
      { customerPhone: rx },
      { transactionId: rx },
      { accountTitle: rx },
    ];
  }

  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).limit(200);
  return res.json(bookings);
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

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Status sirf approved ya rejected ho sakta hai." });
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status, adminNote, meetLink },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ error: "Booking nahi mili." });
  }

  return res.json(booking);
}

module.exports = { login, listBookings, updateBookingStatus, getStats };
