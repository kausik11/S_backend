const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

const VALID_TAGS = [
  "clicnic",
  "care",
  "kids",
  "events",
  "wellness",
  "nutrition",
];

const uploadImage = async (file) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "sbanerjee/gallery",
    resource_type: "auto",
  });

  return {
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  };
};

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => `${tag}`.trim()).filter(Boolean);
  }
  return `${tags}`
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const validateTags = (tags) => {
  if (!tags.length) {
    return "At least one tag is required";
  }

  const invalidTags = tags.filter((tag) => !VALID_TAGS.includes(tag));
  if (invalidTags.length) {
    return `Invalid tags: ${invalidTags.join(", ")}. Use one of ${VALID_TAGS.join(
      ", "
    )}.`;
  }

  return null;
};

const getGalleryItems = async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = {};

    if (tag) {
      if (!VALID_TAGS.includes(tag)) {
        return res.status(400).json({
          message: `Invalid tag. Use one of ${VALID_TAGS.join(", ")}.`,
        });
      }
      filter.tags = tag;
    }

    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    res.status(500).json({ message: "Failed to fetch gallery items" });
  }
};

const getGalleryItemsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    if (!VALID_TAGS.includes(tag)) {
      return res.status(400).json({
        message: `Invalid tag. Use one of ${VALID_TAGS.join(", ")}.`,
      });
    }

    const items = await Gallery.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to fetch gallery items by tag:", error);
    res.status(500).json({ message: "Failed to fetch gallery items by tag" });
  }
};

const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Failed to fetch gallery item:", error);
    res.status(500).json({ message: "Failed to fetch gallery item" });
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const { description } = req.body;
    const tags = normalizeTags(req.body.tags);

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const tagError = validateTags(tags);
    if (tagError) {
      return res.status(400).json({ message: tagError });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { imageUrl, imagePublicId } = await uploadImage(req.file);

    const item = await Gallery.create({
      description,
      tags,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    res.status(500).json({ message: "Failed to create gallery item" });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { description } = req.body;
    const tags = normalizeTags(req.body.tags);
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (description) item.description = description;

    if (req.body.tags !== undefined) {
      const tagError = validateTags(tags);
      if (tagError) {
        return res.status(400).json({ message: tagError });
      }
      item.tags = tags;
    }

    if (req.file) {
      const { imageUrl, imagePublicId } = await uploadImage(req.file);

      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }

      item.imageUrl = imageUrl;
      item.imagePublicId = imagePublicId;
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    res.status(500).json({ message: "Failed to update gallery item" });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();
    res.status(200).json({ message: "Gallery item deleted" });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItemsByTag,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
