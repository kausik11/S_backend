const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    metadata: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      trim: true,
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

faqSchema.index({
  title: "text",
  question: "text",
  answer: "text",
  tags: "text",
  metadata: "text",
});

module.exports = mongoose.model("Faq", faqSchema);
