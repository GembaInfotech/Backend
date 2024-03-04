import mongoose, { Schema } from "mongoose";

const BusinessQueriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Create model
export const BusinessQueries = mongoose.model(
  "BusinessQueries",
  BusinessQueriesSchema
);
