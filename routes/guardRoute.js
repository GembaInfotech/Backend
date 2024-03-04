import express from "express";
const guardRoute = express.Router();
import {
  register,
  guardList,
  getAGuard,
  update,
  login,
} from "../controller/guardController.js";

guardRoute.post("/register/:parkingId", register);
guardRoute.get("", guardList);
guardRoute.get("/:guardId", getAGuard);
guardRoute.put("/:guardId", update);
guardRoute.post("/login", login);

export { guardRoute };
