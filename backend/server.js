import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
const app = express();
import authRoutes from './routes/auth.route.js';


dotenv.config();
app.use(express.json())

app.use("/api/auth", authRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, ( ) => {
    connectDB();
    console.log("Server is running on port ",PORT);
    
})