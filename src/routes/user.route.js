import express from "express";
import userController from "../controllers/user/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", userController.getProfile);

export default userRouter;
