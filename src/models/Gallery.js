const mongoose = require("mongoose");

const VALID_TAGS = [
  "clicnic",
  "care",
  "kids",
  "events",
  "wellness",
  "nutrition",
];

const gallerySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      enum: VALID_TAGS,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
