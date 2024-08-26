import express from 'express';
import { LogIn, LogOut, signUp } from '../controllers/auth.controllers.js';


const authRoutes = express.Router();

authRoutes.post("/signup",signUp);
authRoutes.post("/login",LogIn);
authRoutes.post("/logout",LogOut);

export default authRoutes;