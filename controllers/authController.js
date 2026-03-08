import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.js";

/*
REGISTER
POST /api/auth/register
*/
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Register success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
LOGIN
POST /api/auth/login
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const user = await User.findById(req.user._id).select("-password");

      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
REFRESH TOKEN
POST /api/auth/refresh
*/
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({
      accessToken: newAccessToken,
    });
  } catch {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

/*
LOGOUT
*/
export const logout = (req, res) => {
  // nếu dùng refreshToken DB thì xoá ở đây
  res.json({
    message: "Logout success",
  });
};

/*
GET CURRENT USER
GET /api/auth/me
*/
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
};
