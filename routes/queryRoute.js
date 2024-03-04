import express from "express";
const queriesRoute = express.Router();

import { sayHello, handleQuery } from "../controller/queryController.js";

queriesRoute.get("/hello", sayHello);
queriesRoute.post("/query", handleQuery);

export { queriesRoute };
