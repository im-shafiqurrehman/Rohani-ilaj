const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Booking = require("../models/Booking");
const { normalisePhone, isValidPkMobile } = require("../utils/phone");

const TOKEN_TTL = "30d";

function sign(user) {
  // role travels in the token so requireAdmin can authorise without a DB hit.
  return jwt.sign(
    { id: user._id, phone: user.phone, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email || undefined,
    role: user.role || "user",
  };
}

async function claimGuestBookings(user) {
  await Booking.updateMany(
    { customerPhone: user.phone, user: { $exists: false } },
    { $set: { user: user._id } }
  );
}

// POST /api/auth/signup
async function signup(req, res) {
  const { name, phone, email, password } = req.body || {};

  if (!name || String(name).trim().length < 3) {
    return res.status(400).json({ error: "Poora naam likhein." });
  }
  const normalised = normalisePhone(phone);
  if (!isValidPkMobile(phone)) {
    return res.status(400).json({ error: "Durust Pakistani mobile number likhein, jaise 03001234567." });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: "Password kam az kam 6 characters ka ho." });
  }
  // Required. Booking updates and the post-approval contact number are both
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res
      .status(400)
      .json({ error: "Durust email address likhna zaroori hai." });
  }

  const existing = await User.findOne({ phone: normalised });
  if (existing) {
    return res
      .status(409)
      .json({ error: "Yeh number pehle se registered hai. Login karein." });
  }

  // role is deliberately NOT read from the request body. Accepting it would
  // let anyone mint themselves an admin account through the public signup form.
  const user = await User.create({
    name: String(name).trim(),
    phone: normalised,
    email: cleanEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    // Never read role from req.body — that would let anyone self-promote.
    role: "user",
  });

  await claimGuestBookings(user);

  return res.status(201).json({ token: sign(user), user: publicUser(user) });
}

// POST /api/auth/login
async function login(req, res) {
  const { phone, password } = req.body || {};
  const normalised = normalisePhone(phone);

  const user = normalised ? await User.findOne({ phone: normalised }) : null;
  // Same message either way so the endpoint can't be used to discover which
  // numbers are registered.
  const invalid = { error: "Phone number ya password ghalat hai." };
  if (!user) return res.status(401).json(invalid);

  const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!ok) return res.status(401).json(invalid);

  await claimGuestBookings(user);

  return res.json({ token: sign(user), user: publicUser(user) });
}

// GET /api/auth/me
async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "Account nahi mila." });
  return res.json({ user: publicUser(user) });
}

// GET /api/auth/my-bookings
async function myBookings(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "Account nahi mila." });

  // Match on the account link OR the phone number, so a booking placed as a
  // guest in this session shows up without waiting for the next login.
  const bookings = await Booking.find({
    $or: [{ user: user._id }, { customerPhone: user.phone }],
  })
    .sort({ createdAt: -1 })
    .select(
      "serviceType amount slotTime slotEndTime slotReference calendlyEventName status screenshotUrl meetLink adminNote createdAt"
    )
    .limit(50)
    .lean();

  // The contact number is attached per row, and only where the payment has
  const contactNumber = process.env.SESSION_CONTACT_NUMBER || "";

  return res.json(
    bookings.map((b) =>
      b.status === "approved" && contactNumber
        ? { ...b, contactNumber }
        : b
    )
  );
}

module.exports = { signup, login, me, myBookings };
