const mongoose = require("mongoose");

/*
 * A Booking is created the moment a customer submits the payment-proof form,
 * right after picking a slot on Calendly. It starts as "pending" and an
 * admin manually approves or rejects it after checking the screenshot.
 */
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
    /** Required. The booking acknowledgement and the post-approval contact
     *  number are both delivered here, so a booking without one cannot
     *  actually be fulfilled.
     *  Note: validators do not run on reads, so bookings taken before this
     *  became mandatory still load fine. */
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // ── The booked slot ─────────────────────────────────────────────────
    // Filled from the Calendly API at booking time (see utils/calendly).
    // Absent if CALENDLY_API_TOKEN isn't set or the lookup failed — the
    // booking is still accepted, since the customer has already paid.
    slotTime: {
      type: Date,
    },
    slotEndTime: {
      type: Date,
    },
    /** Short quotable code derived from the Calendly event UUID, e.g.
     *  "4F2A9C31". This is the "slot number" a customer can read out and the
     *  ustad can match against. */
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
    // The customer is no longer asked to type the account title or the TID —
    // both are legible on the receipt itself, and asking a distressed person to
    // transcribe a 15-digit reference from one app into another was the most
    // error-prone step in the flow. Kept on the schema (optional, no longer
    // unique) so bookings taken under the old form still read back intact.
    /** Only collected when the customer says the money came from someone
     *  else's account — otherwise the payer is the customer themselves and
     *  asking for it again is a field they can only get wrong. */
    accountTitle: {
      type: String,
      trim: true,
    },
    paidByThirdParty: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    screenshotUrl: {
      // Cloudinary URL of the single confirmation screenshot — now the only
      // evidence of payment, so it is the one genuinely required field.
      type: String,
      required: true,
    },
    // Cloudinary's MD5 of the uploaded file, when the storage driver reports
    // it. Replaces the old transaction-ID uniqueness check: re-uploading the
    // exact same receipt image for a second booking is rejected.
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
