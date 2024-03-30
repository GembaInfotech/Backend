import express from "express";
const bookingRoute = express.Router();
import {
  createABooking,
  fetchingOnQuery,
  updationOfStatus,
  updationOfTime,
  cancelBooking,
  getBooking,
  createPaymentLink,
} from "../controller/bookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

bookingRoute.post("/",authMiddleware,  createABooking);
bookingRoute.get("/", fetchingOnQuery);
bookingRoute.get("/userBookings", authMiddleware,  getBooking);

bookingRoute.put("/status/:bookingId", updationOfStatus);
bookingRoute.delete("/:bookingId", cancelBooking);
bookingRoute.delete("/:bookingId", cancelBooking);

bookingRoute.put("/time/:bookingId", updationOfTime);
bookingRoute.post("/payments/:id", createPaymentLink);


export { bookingRoute };
