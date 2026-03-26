import bcrypt from "bcryptjs";
import User from "../models/user.js";

/*
REGISTER
POST /api/auth/register
*/
export const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
    });

    res.status(201).json({
      message: "Register success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address,
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

    const user = await User.findOne({ email }).select("+password");

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

    res.json({
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
