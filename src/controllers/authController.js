const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, ...rest } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      ...rest,
    });

    const token = signToken(user);
    return res.status(201).json({ message: "Registered", token, user });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.tokenVersion += 1;
    await user.save();

    const token = signToken(user);
    return res.json({ message: "Logged in", token, user });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    user.tokenVersion += 1;
    await user.save();

    return res.json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, logout };
