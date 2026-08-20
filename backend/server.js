require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const User = require("./models/User");
const { normalisePhone } = require("./utils/phone");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");

// Fail fast with a clear message instead of a confusing crash later on.
const REQUIRED_ENV = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_PHONE",
  "ADMIN_PASSWORD",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `\nMissing environment variables:\n  ${missing.join("\n  ")}\n\n` +
      `Locally: copy .env.example to .env. On Vercel: Project Settings > Environment Variables.\n`
  );
  if (require.main === module) process.exit(1);
}

const app = express();

app.set("trust proxy", 1); // needed for correct IPs behind Vercel/Render

// Known origins, hard-coded so a deploy works without any env var being set.
// CLIENT_ORIGIN still adds to this for preview URLs or a future custom domain.
const KNOWN_ORIGINS = [
  "https://rohaniilajcenter.vercel.app",
  "http://localhost:3000",
];

const normalise = (o) => o.trim().replace(/\/+$/, "");

const ALLOWED_ORIGINS = [
  ...new Set(
    [...KNOWN_ORIGINS, ...(process.env.CLIENT_ORIGIN || "").split(",")]
      .map(normalise)
      .filter(Boolean)
  ),
];

app.use(
  cors({
    origin(origin, cb) {
      // No Origin header: curl, health checks, server-to-server. Allow.
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(normalise(origin))) return cb(null, true);
      // A blocked origin is silent in the browser and looks like an outage —
      // log it so the cause is visible in the platform logs.
      console.warn(
        `CORS blocked ${origin}. Allowed: ${ALLOWED_ORIGINS.join(", ")}`
      );
      return cb(null, false);
    },
  })
);
app.use(express.json());

// Baseline for everything. Generous enough never to affect a real visitor,
// low enough to blunt a script hammering the API.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: "Bohat zyada requests. Thori dair baad koshish karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stops someone from spamming hundreds of fake bookings.
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 booking submissions per IP per hour
  message: { error: "Bohat zyada koshishein. Aik ghante baad dobara try karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Keeps the public contact form from being used as a mail relay.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8, // 8 messages per IP per hour
  message: { error: "Bohat zyada paighamat. Aik ghante baad dobara try karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Reviews get their own budget. Sharing an instance with the contact limiter
// meant one counter for both, so submitting a review consumed the quota for
// asking a question.
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Bohat zyada tassurat. Aik ghante baad try karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authenticated admin endpoints. Guards against a leaked token being used to
// scrape the whole booking table.
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Reading your own session/bookings is harmless and happens on every page
// load, so it gets a separate, looser budget than the credential endpoints.
const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Bohat zyada requests. Thori dair baad koshish karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slows down credential stuffing against customer accounts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Bohat zyada koshishein. 15 minute baad try karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slows down password guessing on the admin login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Bohat zyada login attempts. 15 minute baad try karein." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);

app.use("/api/bookings", bookingLimiter, bookingRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/reviews", reviewLimiter, reviewRoutes);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", sessionLimiter, authRoutes);
app.use("/api/admin/login", loginLimiter);
app.use("/api/admin", adminLimiter, adminRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "Screenshot bohat bari hai. 2MB se kam file bhejein." });
  }
  if (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Screenshot upload nahi ho saki. Dobara koshish karein." });
  }
  next();
});

async function seedAdmin() {
  const phone = normalisePhone(process.env.ADMIN_PHONE);
  if (!phone) {
    console.warn("ADMIN_PHONE is not a usable phone number; skipping admin seed.");
    return;
  }

  const existing = await User.findOne({ phone });

  if (!existing) {
    await User.create({
      name: process.env.ADMIN_NAME || "Administrator",
      phone,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      role: "admin",
    });
    console.log(`Admin account created for ${phone}`);
    return;
  }

  if (existing.role !== "admin") {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing account ${phone} promoted to admin`);
  }
}

let readyPromise = null;

function ready() {
  if (!readyPromise) {
    readyPromise = connectDB()
      .then(() => seedAdmin())
      .catch((err) => {
        // Let the next request retry rather than caching a failed boot.
        readyPromise = null;
        throw err;
      });
  }
  return readyPromise;
}

// Only listen when run as a real process (`npm start`, Render, Railway, local
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  ready().then(() => {
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  });
}

module.exports = { app, ready };
