const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { upload } = require("../utils/cloudinary");
const { optionalUser } = require("../middleware/auth");

// optionalUser never rejects — it just links the booking to an account when
// the customer happens to be signed in. Guests book exactly as before.
router.post("/", optionalUser, upload.single("screenshot"), createBooking);

module.exports = router;
