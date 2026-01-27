const Chamber = require("../models/Chamber");

const normalizeTimings = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean);
  }
  return `${value}`
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatChamber = (chamber) => ({
  ...chamber.toObject(),
  lines: [
    chamber.name,
    ...chamber.timings,
    `Call: ${chamber.contact}`,
  ],
});

const getChambers = async (_req, res) => {
  try {
    const chambers = await Chamber.find().sort({ createdAt: -1 });
    res.status(200).json(chambers.map(formatChamber));
  } catch (error) {
    console.error("Failed to fetch chambers:", error);
    res.status(500).json({ message: "Failed to fetch chambers" });
  }
};

const getChamberById = async (req, res) => {
  try {
    const chamber = await Chamber.findById(req.params.id);

    if (!chamber) {
      return res.status(404).json({ message: "Chamber not found" });
    }

    res.status(200).json(formatChamber(chamber));
  } catch (error) {
    console.error("Failed to fetch chamber:", error);
    res.status(500).json({ message: "Failed to fetch chamber" });
  }
};

const createChamber = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const timings = normalizeTimings(req.body.timings);

    if (!name || !contact || timings.length === 0) {
      return res.status(400).json({
        message: "Name, contact, and timings are required",
      });
    }

    const chamber = await Chamber.create({
      name,
      contact,
      timings,
    });

    res.status(201).json(formatChamber(chamber));
  } catch (error) {
    console.error("Failed to create chamber:", error);
    res.status(500).json({ message: "Failed to create chamber" });
  }
};

const updateChamber = async (req, res) => {
  try {
    const chamber = await Chamber.findById(req.params.id);

    if (!chamber) {
      return res.status(404).json({ message: "Chamber not found" });
    }

    const { name, contact } = req.body;

    if (name) chamber.name = name;
    if (contact) chamber.contact = contact;

    if (req.body.timings !== undefined) {
      const timings = normalizeTimings(req.body.timings);
      if (timings.length === 0) {
        return res.status(400).json({
          message: "Timings must be a non-empty list",
        });
      }
      chamber.timings = timings;
    }

    await chamber.save();
    res.status(200).json(formatChamber(chamber));
  } catch (error) {
    console.error("Failed to update chamber:", error);
    res.status(500).json({ message: "Failed to update chamber" });
  }
};

const deleteChamber = async (req, res) => {
  try {
    const chamber = await Chamber.findById(req.params.id);

    if (!chamber) {
      return res.status(404).json({ message: "Chamber not found" });
    }

    await chamber.deleteOne();
    res.status(200).json({ message: "Chamber deleted" });
  } catch (error) {
    console.error("Failed to delete chamber:", error);
    res.status(500).json({ message: "Failed to delete chamber" });
  }
};

module.exports = {
  getChambers,
  getChamberById,
  createChamber,
  updateChamber,
  deleteChamber,
};
