const mongoose = require("mongoose");

const VALID_STATUSES = ["pending", "not received", "done"];
const VALID_LOCATIONS = ["kolkata", "howrah", "bardhaman"];

const callbackRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    location: {
      type: String,
      required: true,
      enum: VALID_LOCATIONS,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: "pending",
    },
    adminComment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallbackRequest", callbackRequestSchema);
