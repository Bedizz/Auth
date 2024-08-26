import {User} from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { setCookie } from "../utils/setCookie.js"
import { sendVerificationEmail } from "../mailtrap/emails.js"
export const signUp = async (req, res) => {
    const {email,password,name} = req.body
    try {
        if(!email || !password || !name) {
            throw new Error ("All fields are required")
        }
        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const verificationToken = Math.floor(100000 + Math.random()* 900000).toString()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now()+ 24*60*60*1000
        })
        await user.save();

        setCookie(res,user._id)
        await sendVerificationEmail(user.email,verificationToken)
        res.status(201).json({success: true, message:"User signed up successfully",user: {...user._doc,password: undefined}})
        //in order not to return password, we can write it like this.
        
    } catch (error) {
        res.status(500).json({"Success": false, message: error.message})
    }
}
export const LogIn = async (req, res) => {}
export const LogOut = async (req, res) => {}