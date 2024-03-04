import express from "express";
const userRoute = express.Router();
import {
  createEndUser,
  login,
  addvehicle,
  getVehiclesById,
  updateEndUserEmail,
  getAllEndUsers,
  verifyOTP,
  sendOtp,
} from "../controller/userController.js";


userRoute.post("/login", login);
userRoute.post("/register", createEndUser);
userRoute.post("/addVehicle/:id", addvehicle);
userRoute.get("/getVehicles/:id", getVehiclesById);
userRoute.post("/sendOtp/:id", sendOtp);
userRoute.get("/get", getAllEndUsers);
userRoute.post("/verify/:id", verifyOTP);
userRoute.post("/update/:id", updateEndUserEmail);


export { userRoute };
