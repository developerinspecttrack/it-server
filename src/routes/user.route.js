import express from "express";
import userController from "../controllers/user/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", userController.getProfile);
userRouter.put("/userRole", userController.setUserRole);
userRouter.post("/profile/update", userController.setUserProfile);

export default userRouter;
