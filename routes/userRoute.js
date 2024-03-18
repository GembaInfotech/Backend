import express from "express";
const userRoute = express.Router();
import {
  createEndUser,
  login,
  verify,
  addvehicle,
  deletevehicle,
  getVehiclesById,
  updateEndUserEmail,
  getAllEndUsers,
  verifyOTP,
  sendOtp,
  setDefaultVehicle,
  userData
} from "../controller/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

userRoute.get("/userData",authMiddleware, userData )
userRoute.post("/login", login);
userRoute.post("/register", createEndUser);
userRoute.post("/addVehicle",authMiddleware, addvehicle);
userRoute.delete("/vehicle/:vid",authMiddleware, deletevehicle);
userRoute.get("/getVehicles",  authMiddleware,  getVehiclesById);
userRoute.post("/sendOtp/:id", sendOtp);
userRoute.get("/get", getAllEndUsers);
userRoute.post("/verify/:id", verifyOTP);
userRoute.get("/token/:token", verify);
userRoute.put("/setDefaultVehicle",authMiddleware, setDefaultVehicle);

userRoute.post("/update/:id", updateEndUserEmail);


export { userRoute };
