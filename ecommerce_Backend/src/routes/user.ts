import express from "express";
import { deleteUser, getAllUsers, getUsers, loginUser, logoutUser, registerUser, updateUser } from "../controllers/user.js";
import { adminOnly, verifyToken } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.get("/verify", verifyToken)
app.post("/new", registerUser);
app.post("/login", loginUser);
app.post("/logout", logoutUser);

app.get("/all", adminOnly, getAllUsers);

app.route('/:id')
.get(getUsers)
.put(singleUpload, updateUser)
.delete(adminOnly, deleteUser);

export default app;