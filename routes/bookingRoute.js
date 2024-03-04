import express from "express";
const bookingRoute = express.Router();
import {
  createABooking,
  fetchingOnQuery,
  updationOfStatus,
  updationOfTime,
  cancelBooking,
} from "../controller/bookingController.js";

bookingRoute.post("/", createABooking);
bookingRoute.get("/", fetchingOnQuery);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
bookingRoute.put("/status/:bookingId", updationOfStatus);
bookingRoute.delete("/:bookingId", cancelBooking);
bookingRoute.put("/time/:bookingId", updationOfTime);

export { bookingRoute };
