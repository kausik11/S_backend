const CallbackRequest = require("../models/CallbackRequest");
const cloudinary = require("../config/cloudinary");

const VALID_STATUSES = ["pending", "not received", "done"];
const VALID_LOCATIONS = ["kolkata", "howrah", "bardhaman"];

const uploadImage = async (file) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "sbanerjee/callbacks",
    resource_type: "auto",
  });

  return {
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  };
};

const createCallback = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, location, description } = req.body;

    if (!fullName || !phoneNumber || !email || !location) {
      return res.status(400).json({
        message: "Full name, phone number, email, and location are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!VALID_LOCATIONS.includes(location)) {
      return res.status(400).json({
        message: "Invalid location. Use kolkata, howrah, or bardhaman",
      });
    }

    let imageUrl;
    let imagePublicId;
    if (req.file) {
      const uploaded = await uploadImage(req.file);
      imageUrl = uploaded.imageUrl;
      imagePublicId = uploaded.imagePublicId;
    }

    const callback = await CallbackRequest.create({
      fullName,
      phoneNumber,
      email,
      location,
      description,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(callback);
  } catch (error) {
    console.error("Failed to create callback request:", error);
    res.status(500).json({ message: "Failed to create callback request" });
  }
};

const updateCallback = async (req, res) => {
  try {
    const {
      status,
      adminComment,
      fullName,
      phoneNumber,
      email,
      location,
      description,
    } = req.body;
    const callback = await CallbackRequest.findById(req.params.id);

    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }

    if (fullName !== undefined) callback.fullName = fullName;
    if (phoneNumber !== undefined) callback.phoneNumber = phoneNumber;
    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      callback.email = email;
    }
    if (location !== undefined) {
      if (!VALID_LOCATIONS.includes(location)) {
        return res.status(400).json({
          message: "Invalid location. Use kolkata, howrah, or bardhaman",
        });
      }
      callback.location = location;
    }
    if (description !== undefined) {
      callback.description = description;
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status. Use pending, not received, or done" });
      }
      callback.status = status;
    }

    if (adminComment !== undefined) {
      callback.adminComment = adminComment;
    }

    if (req.file) {
      const { imageUrl, imagePublicId } = await uploadImage(req.file);

      if (callback.imagePublicId) {
        await cloudinary.uploader.destroy(callback.imagePublicId);
      }

      callback.imageUrl = imageUrl;
      callback.imagePublicId = imagePublicId;
    }

    await callback.save();
    res.status(200).json(callback);
  } catch (error) {
    console.error("Failed to update callback request:", error);
    res.status(500).json({ message: "Failed to update callback request" });
  }
};

const listCallbacks = async (_req, res) => {
  try {
    const callbacks = await CallbackRequest.find().sort({ createdAt: -1 });
    res.status(200).json(callbacks);
  } catch (error) {
    console.error("Failed to fetch callback requests:", error);
    res.status(500).json({ message: "Failed to fetch callback requests" });
  }
};

const getCallback = async (req, res) => {
  try {
    const callback = await CallbackRequest.findById(req.params.id);

    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }

    res.status(200).json(callback);
  } catch (error) {
    console.error("Failed to fetch callback request:", error);
    res.status(500).json({ message: "Failed to fetch callback request" });
  }
};

const deleteCallback = async (req, res) => {
  try {
    const callback = await CallbackRequest.findById(req.params.id);

    if (!callback) {
      return res.status(404).json({ message: "Callback request not found" });
    }

    if (callback.imagePublicId) {
      await cloudinary.uploader.destroy(callback.imagePublicId);
    }

    await callback.deleteOne();
    res.status(200).json({ message: "Callback request deleted" });
  } catch (error) {
    console.error("Failed to delete callback request:", error);
    res.status(500).json({ message: "Failed to delete callback request" });
  }
};

module.exports = {
  createCallback,
  updateCallback,
  listCallbacks,
  getCallback,
  deleteCallback,
};
