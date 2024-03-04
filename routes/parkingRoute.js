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

parkingRoute.get("/:lat/:long/:radius", parkingList);
parkingRoute.get("/:parkingId", getAParking);
parkingRoute.post("/register/:vendorId", register);
parkingRoute.put("/update/:id", update);

parkingRoute.get("/:id", getParkingdetail);
parkingRoute.delete("/:parkingId", deleteParking);

export { parkingRoute };
