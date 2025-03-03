import express from 'express';
import authController from '../controllers/auth/auth.controller.js';


const authRouter = express.Router()

authRouter.post("/login", authController.loginUser)
authRouter.post("/login/verify", authController.verifyOtp)



export default authRouter
