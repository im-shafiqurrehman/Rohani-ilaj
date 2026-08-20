const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const {
  login,
  listBookings,
  updateBookingStatus,
  getStats,
  createBookingAsAdmin,
} = require("../controllers/adminController");

router.post("/login", login);
router.get("/stats", requireAdmin, getStats);
router.get("/bookings", requireAdmin, listBookings);
router.post("/bookings", requireAdmin, createBookingAsAdmin);
router.patch("/bookings/:id", requireAdmin, updateBookingStatus);

module.exports = router;
