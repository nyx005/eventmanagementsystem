import jwt from "jsonwebtoken";
import User from "../models/User.js";
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getMe = (req, res) => {
  res.json({ user: publicUser(req.user) });
};
export const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (name) req.user.name = name;
    if (password) req.user.password = password;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
