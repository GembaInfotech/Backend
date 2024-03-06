import mongoose from "mongoose";

// Define booking schema
const bookingSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
    // required: true
  },
  parkingid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parking", // Reference to the Parking model
    required: true,
  },
  pn: {
    type: String,
  },
  In: {
    type: Date,
    // required: true
  },
  out: {
    type: Date,
    // required: true
  },

  et: Number,
  num: String,
  price: Number,
  cgst:Number,
  sgst:Number,
  ep: Number,
  tp:Number,
  status: {
    type: String,
    enum: ["Incoming", "Parked", "Completed"],
    default: "Incoming",
  },
});

// Create Booking model
export const Booking = mongoose.model("booking", bookingSchema);
