import express from "express";
const vendorRoute = express.Router();
import { vendorAuth } from "../middlewares/authMiddleware.js";
import {
  login,
  getparking,
  register,
  vendorList,
  update,
  verify,
  vendorData
} from "../controller/vendorController.js";

vendorRoute.get("/vendorData",vendorAuth, vendorData )

vendorRoute.get("/getparking",vendorAuth, getparking);
vendorRoute.get("/verify/:token", verify);
vendorRoute.post("/login",  login);
vendorRoute.put("/",vendorAuth, update);
vendorRoute.post("/register", register);
vendorRoute.get("", vendorList);

export { vendorRoute };
