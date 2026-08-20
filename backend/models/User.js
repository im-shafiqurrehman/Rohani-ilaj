const mongoose = require("mongoose");

const ROLES = ["user", "admin"];

/*
 * One account model for everyone. Access is decided by `role`, not by which
 * collection the record lives in — an admin is a user who happens to have
 * role "admin", so the ustad can also hold a normal booking history.
 *
 * Booking itself stays optional: the public flow works fully signed-out.
 * Phone is the identity rather than email, because it's what this audience
 * has and remembers, and it's already the key bookings are matched on.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Stored normalised (see utils/phone) so a guest booking can be claimed by
    // an account created afterwards.
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.isAdmin = function isAdmin() {
  return this.role === "admin";
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
