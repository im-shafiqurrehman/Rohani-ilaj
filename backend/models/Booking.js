const mongoose = require("mongoose");

/*
 * A Booking is created the moment a customer submits the payment-proof form,
 * right after picking a slot on Calendly. It starts as "pending" and an
 * admin manually approves or rejects it after checking the screenshot.
 */
const bookingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["call", "physical"],
      required: true,
    },
    amount: {
      // Stored in PKR. 2000 for "call", 5000 for "physical".
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    // The date/time the customer picked in Calendly, sent to us from the
    // Calendly redirect/webhook payload so we can show it in the admin panel.
    slotTime: {
      type: Date,
    },
    calendlyEventUri: {
      type: String,
    },
    // Payment proof fields.
    // Card (bank transfer from the customer's debit/credit card account) is
    // the only method the site offers, so this is effectively a constant —
    // kept as a field so a second method can be added without a migration.
    // Note: validators don't run on reads or on findByIdAndUpdate, so any
    // bookings taken under the old jazzcash/easypaisa flow still load fine.
    paymentMethod: {
      type: String,
      enum: ["card"],
      default: "card",
      required: true,
    },
    accountTitle: {
      // Name on the account the payment was sent FROM
      type: String,
      required: true,
      trim: true,
    },
    transactionId: {
      // The TID / reference number shown on the bank transfer receipt.
      // Unique so the same payment receipt can't be submitted twice.
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    screenshotUrl: {
      // Cloudinary URL of the single confirmation screenshot
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Filled in once approved and a Google Meet link is generated for the slot
    meetLink: {
      type: String,
    },
    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
