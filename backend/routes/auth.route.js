import express from 'express';
import { LogIn, LogOut, signUp,VerifyEmail,ForgotPassword,ResetPassword,checkAuth } from '../controllers/auth.controllers.js';
import {verifyToken} from "../middleware/verifyToken.js"


const authRoutes = express.Router();

authRoutes.get("/check-auth",verifyToken,checkAuth)
authRoutes.post("/signup",signUp);
authRoutes.post("/login",LogIn);
authRoutes.post("/logout",LogOut);
authRoutes.post("/verify-email",VerifyEmail)
authRoutes.post("/forgot-password",ForgotPassword)
authRoutes.post("/reset-password/:token",ResetPassword)



export default authRoutes;