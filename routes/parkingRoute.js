import express from "express";
const parkingRoute = express.Router();
import {
  getAParking,
  register,
  getParkingdetail,
  deleteParking,
  parkingList,
  update
} from "../controller/parkingController.js";
import { authMiddleware, vendorAuth } from "../middlewares/authMiddleware.js";

parkingRoute.get("/:lat/:long/:radius", parkingList);
parkingRoute.get("/:parkingId", getAParking);
parkingRoute.post("/register", vendorAuth,  register);
parkingRoute.put("/update/:id", update);

parkingRoute.get("/:id", getParkingdetail);
parkingRoute.delete("/:id", deleteParking);

export { parkingRoute };
