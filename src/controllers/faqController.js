const Faq = require("../models/Faq");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (file) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "sbanerjee/faqs",
    resource_type: "auto",
  });

  return {
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  };
};

const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean);
  }
  return `${value}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getFaqs = async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = {};

    if (tag) {
      filter.tags = tag;
    }

    const faqs = await Faq.find(filter).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Failed to fetch faqs:", error);
    res.status(500).json({ message: "Failed to fetch faqs" });
  }
};

const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "Faq not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    console.error("Failed to fetch faq:", error);
    res.status(500).json({ message: "Failed to fetch faq" });
  }
};

const createFaq = async (req, res) => {
  try {
    const { title, question, answer, link } = req.body;
    const tags = normalizeList(req.body.tags);
    const metadata = normalizeList(req.body.metadata);

    if (!title || !question || !answer) {
      return res
        .status(400)
        .json({ message: "Title, question, and answer are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { imageUrl, imagePublicId } = await uploadImage(req.file);

    const faq = await Faq.create({
      title,
      question,
      answer,
      tags,
      metadata,
      link,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error("Failed to create faq:", error);
    res.status(500).json({ message: "Failed to create faq" });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { title, question, answer, link } = req.body;
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "Faq not found" });
    }

    if (title) faq.title = title;
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (link !== undefined) faq.link = link;

    if (req.body.tags !== undefined) {
      faq.tags = normalizeList(req.body.tags);
    }

    if (req.body.metadata !== undefined) {
      faq.metadata = normalizeList(req.body.metadata);
    }

    if (req.file) {
      const { imageUrl, imagePublicId } = await uploadImage(req.file);

      if (faq.imagePublicId) {
        await cloudinary.uploader.destroy(faq.imagePublicId);
      }

      faq.imageUrl = imageUrl;
      faq.imagePublicId = imagePublicId;
    }

    await faq.save();
    res.status(200).json(faq);
  } catch (error) {
    console.error("Failed to update faq:", error);
    res.status(500).json({ message: "Failed to update faq" });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "Faq not found" });
    }

    await faq.deleteOne();
    res.status(200).json({ message: "Faq deleted" });
  } catch (error) {
    console.error("Failed to delete faq:", error);
    res.status(500).json({ message: "Failed to delete faq" });
  }
};

const searchFaqs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), "i");
    const faqs = await Faq.find({
      $or: [
        { title: regex },
        { question: regex },
        { answer: regex },
        { tags: regex },
        { metadata: regex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(faqs);
  } catch (error) {
    console.error("Failed to search faqs:", error);
    res.status(500).json({ message: "Failed to search faqs" });
  }
};

const getFaqsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const faqs = await Faq.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Failed to fetch faqs by tag:", error);
    res.status(500).json({ message: "Failed to fetch faqs by tag" });
  }
};

module.exports = {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  searchFaqs,
  getFaqsByTag,
};
