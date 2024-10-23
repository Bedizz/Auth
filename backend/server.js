import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import cors from "cors"
const app = express();
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();
app.use(cors({ origin:"http://localhost:5173", credentials: true}))
app.use(express.json()) // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, ( ) => {
    connectDB();
    console.log("Server is running on port ",PORT);
    
})