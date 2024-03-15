import mongoose from "mongoose";

// Define parking detail schema
const parkingSchema = new mongoose.Schema({
  pn: {
    type: String,
    required: true,
  },
  pa: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  st: String,
  country: {
    type: String,
    required: true,
  },
  pc: {
    type: Number,
    required: true,
  },
  gst: {
    type: String,
    // required: true,
  },
  ln: {
    type: String,
    // required: true,
  },
  sc: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  ep: {
    type: Number,
    // required: true,
  },
  mt: {
    type: Number,
    // required: true,
  },
  met: {
    type: Number,
    // required: true,
  },
  sub: {
  // type: Boolean,
  },
  subc: {
    // type: String,
    },
  subamt: {
    // type: Number,
  },
  lm: String,
  cc: {
    type: Number,
    required: true,
  },

 
  lc: {
    type: {
      type: String,
      enum: ["Point"], 
      required: true,
    },
    cord: {
      type: [Number],
      required: true,
    },
  },
  assg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "guard", // Reference to the Guard model if needed
  },
  acc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Reference to the Account model
  },
  currentstatus: {
    type: String,
    enum: ["Active", "Temporarily Inactive", "Inactive"],
    default: "Inactive",
  },
  description :{
    type:String,

  },

  image: [String],
});
parkingSchema.index({ location: "2dsphere" });

// Create ParkingDetail model
export const Parking = mongoose.model(
  "parking",
  parkingSchema
);
