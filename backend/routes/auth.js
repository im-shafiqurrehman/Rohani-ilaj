const express = require("express");
const router = express.Router();
const { signup, login, me, myBookings } = require("../controllers/authController");
const { requireUser } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireUser, me);
router.get("/my-bookings", requireUser, myBookings);

module.exports = router;
