const mongoose = require("mongoose");

const chamberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    timings: {
      type: [String],
      required: true,
      validate: {
        validator: (value) =>
          Array.isArray(value) && value.every((item) => `${item}`.trim()),
        message: "Timings must be a non-empty list of strings",
      },
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chamber", chamberSchema);
