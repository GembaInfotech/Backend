import mongoose, { Schema } from "mongoose";
import bcrypt, { genSaltSync } from "bcrypt";
import crypto from "crypto";

// Define vendor schema
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  mob: Number,
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  add: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  verificationToken: {
    type: String,
  },

  parkings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parking", 
    },
  ],
 
  image: String,
});
vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

vendorSchema.methods.isPassWordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

vendorSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10minutes
  return resetToken;
};
// Create Vendor mode
export const Vendor = mongoose.model("vendor", vendorSchema);
