import express from "express";
const vendorRoute = express.Router();
import {
  login,
  getparking,
  register,
  vendorList,
  update,
  verify,
} from "../controller/vendorController.js";

vendorRoute.get("/getparking/:id", getparking);
vendorRoute.get("/verify/:token", verify);
vendorRoute.post("/login", login);
vendorRoute.put("/:vendorId", update);
vendorRoute.post("/register", register);
vendorRoute.get("", vendorList);

export { vendorRoute };
