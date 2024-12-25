import { Router } from "express";
import { newAddress } from "../controllers/address.js";

const app = Router();

app.post("/new", newAddress);


export default app;