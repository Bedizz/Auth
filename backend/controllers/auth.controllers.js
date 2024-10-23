import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { setCookie } from "../utils/setCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import crypto from "crypto";

export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();

    setCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    res
      .status(201)
      .json({
        success: true,
        message: "User signed up successfully",
        user: { ...user._doc, password: undefined },
      });
    //in order not to return password, we can write it like this.
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};
export const VerifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return (
        res.status(400),
        json({
          success: false,
          message: "Invalid or expired verification code",
        })
      );

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "User is verified",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid or expired verification code" });
  }
};
export const LogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    generateVerificationToken();
    setCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({ success: true, message: "Logged in successfully", user: {
      ...user._doc,
      password: undefined,
    }, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const LogOut = async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not exist" });

    // Generate reset token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    console.log(resetPasswordToken);
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    // match those with user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    console.log(
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent to your email successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    //update password
    const hashedPassword = await bcrypt.hash(password, 10);
    (user.password = hashedPassword),
      (user.resetPasswordToken = undefined),
      (user.resetPasswordExpiresAt = undefined),
      await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req,res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not exist" });
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
