import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//////////////////////////////
// REGISTER
//////////////////////////////
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

//////////////////////////////
// LOGIN
//////////////////////////////
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    user,
  });
};

//////////////////////////////
// GET PROFILE
//////////////////////////////
export const getProfile = async (req, res) => {
  res.json(req.user);
};
