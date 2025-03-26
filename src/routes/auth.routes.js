import express from "express";
import authController from "../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/login/verify", authController.verifyOtp);
authRouter.post("/login/resend-otp", authController.resendOtp);

export default authRouter;
