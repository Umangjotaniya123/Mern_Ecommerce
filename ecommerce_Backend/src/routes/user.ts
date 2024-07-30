import express from "express";
import { deleteUser, getAllUsers, getUsers, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", newUser)

app.get("/all", adminOnly, getAllUsers);

app.route("/:id").get(getUsers).delete(adminOnly, deleteUser);

export default app;