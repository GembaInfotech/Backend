import mongoose from "mongoose";
import { Guard } from "./gaurd.js";

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

 
  location: {
    type: {
      type: String,
      enum: ["Point"], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  assg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guard", // Reference to the Guard model if needed
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
parkingSchema.index({ lc: "2dsphere" }); // Indexing the lc field for geospatial queries

// Create ParkingDetail model
export const Parking = mongoose.model(
  "parking",
  parkingSchema
);
