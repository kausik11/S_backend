const Chamber = require("../models/Chamber");
const ChamberAvailability = require("../models/ChamberAvailability");

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

const formatAvailability = (availability) => {
  if (!availability) return null;
  const now = new Date();
  const start = new Date(availability.startDate);
  const end = new Date(availability.endDate);
  const isClosed = now >= start && now <= end;

  return {
    ...availability.toObject(),
    isClosed,
  };
};

const getAvailability = async (_req, res) => {
  try {
    const availability = await ChamberAvailability.findOne().sort({ createdAt: -1 });
    res.status(200).json(formatAvailability(availability));
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

const createAvailability = async (req, res) => {
  try {
    const { startDate, endDate, message, note } = req.body;

    if (!startDate || !endDate || !message) {
      return res.status(400).json({
        message: "Start date, end date, and message are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    if (end < start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const availability = await ChamberAvailability.create({
      startDate: start,
      endDate: end,
      message,
      note: note || "",
    });

    res.status(201).json(formatAvailability(availability));
  } catch (error) {
    console.error("Failed to create availability:", error);
    res.status(500).json({ message: "Failed to create availability" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const availability = await ChamberAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    const { startDate, endDate, message, note } = req.body;

    if (startDate) {
      const start = new Date(startDate);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid start date" });
      }
      availability.startDate = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (Number.isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid end date" });
      }
      availability.endDate = end;
    }

    if (message !== undefined) availability.message = message;
    if (note !== undefined) availability.note = note;

    if (availability.endDate < availability.startDate) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    await availability.save();
    res.status(200).json(formatAvailability(availability));
  } catch (error) {
    console.error("Failed to update availability:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const availability = await ChamberAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    await availability.deleteOne();
    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    console.error("Failed to delete availability:", error);
    res.status(500).json({ message: "Failed to delete availability" });
  }
};

module.exports = {
  getChambers,
  getChamberById,
  createChamber,
  updateChamber,
  deleteChamber,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
};
