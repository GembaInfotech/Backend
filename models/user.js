import mongoose from "mongoose";
import bcrypt, { genSaltSync } from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mob: {
    type: Number,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  add: String,
  city: String,
  pc: Number,
  lic:{
    type :String,
  },
  st: String,
  country: String,
  verificationToken: String,
  verfied:{
    type:Boolean,
    default:false
  },
  vehicle: [
    {
      name: {
        type: String,
      },
       num: {
        type: String,
      },
      type: {
        type: String,
        enum: ["four wheeler", "two wheeler"],
      },
      def:{
        type:Boolean,
        default:false
      }
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPassWordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() 
  return resetToken;
};

export const User = mongoose.model("user", userSchema);
