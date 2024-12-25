import express from "express";
import { deleteUser, getAllUsers, getUsers, newUser, updateUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", newUser)

app.get("/all", adminOnly, getAllUsers);

app.route('/:id')
.get(getUsers)
.put(singleUpload, updateUser)
.delete(adminOnly, deleteUser);

export default app;