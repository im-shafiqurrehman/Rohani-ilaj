const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Set when the booking was placed while signed in, or backfilled when an
    // account is later created with the same phone number. Absent for guests.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
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
    customerEmail: {
      // Required for self-serve bookings, since that is the only channel the
      // confirmation travels on. Optional when an admin books on someone's
      // behalf, because those customers are reached on WhatsApp instead.
      type: String,
      required: function () {
        return !this.createdByAdmin;
      },
      trim: true,
      lowercase: true,
    },
    // ── The booked slot ─────────────────────────────────────────────────
    slotTime: {
      type: Date,
    },
    slotEndTime: {
      type: Date,
    },
    slotReference: {
      type: String,
      trim: true,
      index: true,
    },
    calendlyEventName: {
      type: String,
      trim: true,
    },
    calendlyEventUri: {
      type: String,
    },
    // Payment proof fields.
    paymentMethod: {
      type: String,
      enum: ["card"],
      default: "card",
      required: true,
    },
    // The customer is no longer asked to type the account title or the TID —
    accountTitle: {
      type: String,
      trim: true,
    },
    paidByThirdParty: {
      type: Boolean,
      default: false,
    },
    /** Entered by the practitioner rather than booked by the customer. */
    createdByAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    screenshotUrl: {
      // The customer's proof of payment. Not required for an admin-entered
      // booking: the practitioner has already seen the receipt on WhatsApp.
      type: String,
      required: function () {
        return !this.createdByAdmin;
      },
    },
    // Cloudinary's MD5 of the uploaded file, when the storage driver reports
    screenshotEtag: {
      type: String,
      index: true,
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
