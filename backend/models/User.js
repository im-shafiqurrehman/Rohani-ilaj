const mongoose = require("mongoose");

const ROLES = ["user", "admin"];

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
