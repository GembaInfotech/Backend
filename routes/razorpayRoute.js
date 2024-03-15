import express from "express";
const razorpayRoute = express.Router();
import { sayHello, order, validate } from "../controller/razorpayController.js";

razorpayRoute.get("/hello", sayHello);
razorpayRoute.post("/order", order);
razorpayRoute.post("/order/validate", validate);


export { razorpayRoute };
