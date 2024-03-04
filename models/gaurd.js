import mongoose, { Schema } from "mongoose";
import bcrypt, { genSaltSync } from "bcrypt";
import crypto from "crypto";
const guardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  add:{
    type:String
  },
  adhar: {
    type: String,
  },
  parkingid: {
    type: String,
  },

  mob: {
    type: Number,
  },
  add: String,

  image: String,
  active:{
    type:Boolean, 
    default:true
  }
});

guardSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

guardSchema.methods.isPassWordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

guardSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10minutes
  return resetToken;
};

// Export the model
export const Guard = mongoose.model("Guard", guardSchema);
