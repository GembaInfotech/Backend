import express from "express";
const vehicleRoute = express.Router();
import {
  getVehicle,
  getAllVehicle,
  deleteVehicle,
  updateVehicle,
  makePermanent,
  addVehicle,
} from "../controller/vehicleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

vehicleRoute.post("/", authMiddleware, addVehicle);
vehicleRoute.get("/", authMiddleware, getAllVehicle);
vehicleRoute.get("/:id", getVehicle);
vehicleRoute.put("/:id", updateVehicle);
vehicleRoute.delete("/:id", deleteVehicle);
vehicleRoute.put("/mp/:id", authMiddleware, makePermanent);

export { vehicleRoute };
