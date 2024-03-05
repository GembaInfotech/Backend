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
} from "../controller/userController.js";


userRoute.post("/login", login);
userRoute.post("/register", createEndUser);
userRoute.post("/addVehicle/:id", addvehicle);
userRoute.delete("/deleteVehicle/:userid", deletevehicle);
userRoute.get("/getVehicles/:id", getVehiclesById);
userRoute.post("/sendOtp/:id", sendOtp);
userRoute.get("/get", getAllEndUsers);
userRoute.post("/verify/:id", verifyOTP);
userRoute.get("/token/:token", verify);
userRoute.put("/setDefaultVehicle/:userid", setDefaultVehicle);

userRoute.post("/update/:id", updateEndUserEmail);


export { userRoute };
