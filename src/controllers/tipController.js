const Tip = require("../models/Tip");

const getTips = async (_req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.status(200).json(tips);
  } catch (error) {
    console.error("Failed to fetch tips:", error);
    res.status(500).json({ message: "Failed to fetch tips" });
  }
};

const getTipById = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    res.status(200).json(tip);
  } catch (error) {
    console.error("Failed to fetch tip:", error);
    res.status(500).json({ message: "Failed to fetch tip" });
  }
};

const createTip = async (req, res) => {
  try {
    const { title, text, imageUrl } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: "Title and text are required" });
    }

    const tip = await Tip.create({
      title,
      text,
      imageUrl: imageUrl ? imageUrl.trim() : "",
    });

    res.status(201).json(tip);
  } catch (error) {
    console.error("Failed to create tip:", error);
    res.status(500).json({ message: "Failed to create tip" });
  }
};

const updateTip = async (req, res) => {
  try {
    const { title, text, imageUrl } = req.body;
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    if (title) tip.title = title;
    if (text) tip.text = text;
    if (imageUrl !== undefined) tip.imageUrl = imageUrl ? imageUrl.trim() : "";

    await tip.save();

    res.status(200).json(tip);
  } catch (error) {
    console.error("Failed to update tip:", error);
    res.status(500).json({ message: "Failed to update tip" });
  }
};

const deleteTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    await tip.deleteOne();

    res.status(200).json({ message: "Tip deleted" });
  } catch (error) {
    console.error("Failed to delete tip:", error);
    res.status(500).json({ message: "Failed to delete tip" });
  }
};

module.exports = {
  getTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
};
