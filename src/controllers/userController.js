const User = require("../models/User");

const createUser = async (req, res, next) => {
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

    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      designation,
      role,
      userImage,
      userImagePublicId,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const existing = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase().trim();
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (designation !== undefined) user.designation = designation;
    if (role !== undefined) user.role = role;
    if (userImage !== undefined) user.userImage = userImage;
    if (userImagePublicId !== undefined) user.userImagePublicId = userImagePublicId;

    await user.save();
    return res.json({ message: "User updated", user });
  } catch (error) {
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    user.tokenVersion += 1;
    await user.save();

    return res.json({ message: "Password updated" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createUser, listUsers, updateUser, updatePassword };
