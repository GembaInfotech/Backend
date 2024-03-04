import express from "express";
const bookingRoute = express.Router();
import {
  createABooking,
  fetchingOnQuery,
  getbookingByParkingId,
  updationOfStatus,
  updationOfTime,
  cancelBooking,
} from "../controller/bookingController.js";

bookingRoute.post("/", createABooking);
bookingRoute.get("/", fetchingOnQuery);
bookingRoute.get("/:parkingId", getbookingByParkingId);
bookingRoute.put("/status/:bookingId", updationOfStatus);
bookingRoute.delete("/:bookingId", cancelBooking);
bookingRoute.put("/time/:bookingId", updationOfTime);

export { bookingRoute };
