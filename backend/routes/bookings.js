const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { upload } = require("../utils/cloudinary");

router.post("/", upload.single("screenshot"), createBooking);

module.exports = router;
