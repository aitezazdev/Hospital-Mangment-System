import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import jwt from "jsonwebtoken";


export const SignUpUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, phone } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords does not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: req.body.phone || "",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};


export const SignInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `user with this email ${email} not found`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    let hasProfile = false;
    let isApproved = false;
    if (user.role === "patient") {
      const profile = await Patient.findOne({ user: user._id });
      hasProfile = !!profile;
    } else if (user.role === "doctor") {
      const profile = await Doctor.findOne({ user: user._id });
      hasProfile = !!profile;
      if (profile) {
        isApproved = profile.isApproved;
      }
    }

    const userResponse = {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    if (user.role === "patient" || user.role === "doctor") {
      userResponse.hasProfile = hasProfile;
    }

    if (user.role === "doctor") {
      userResponse.isApproved = isApproved;
    }

    return res.status(200).json({
      success: true,
      message: "User signin successfully",
      user: userResponse,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};


export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let hasProfile = false;
    let isApproved = false;

    if (user.role === "patient") {
      const profile = await Patient.findOne({ user: user._id });
      hasProfile = !!profile;
    } else if (user.role === "doctor") {
      const profile = await Doctor.findOne({ user: user._id });
      hasProfile = !!profile;
      if (profile) {
        isApproved = profile.isApproved;
      }
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        hasProfile,
        ...(user.role === "doctor" && { isApproved }),
      },
    });
  } catch (error) {
    next(error);
  }
};


export const RefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid refresh token: user not found" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};


export const LogOutUser = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error);
  }
};
