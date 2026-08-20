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
    `\nMissing environment variables in backend/.env:\n  ${missing.join("\n  ")}\n\n` +
      `Copy .env.example to .env and fill these in before starting the server.\n`
  );
  process.exit(1);
}

const app = express();

app.set("trust proxy", 1); // needed for correct IPs behind Vercel/Render

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:3000")
      .split(",")
      .map((o) => o.trim()),
  })
);
app.use(express.json());

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

app.use("/api/bookings", bookingLimiter, bookingRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin/login", loginLimiter);
app.use("/api/admin", adminRoutes);

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
