const VideoGallery = require("../models/VideoGallery");

const getVideoGallery = async (_req, res) => {
  try {
    const videos = await VideoGallery.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Failed to fetch video gallery:", error);
    res.status(500).json({ message: "Failed to fetch video gallery" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await VideoGallery.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Failed to fetch video:", error);
    res.status(500).json({ message: "Failed to fetch video" });
  }
};

const createVideo = async (req, res) => {
  try {
    const { videoLink, title, description } = req.body;

    if (!videoLink || !title || !description) {
      return res.status(400).json({
        message: "Video link, title, and description are required",
      });
    }

    const video = await VideoGallery.create({
      videoLink,
      title,
      description,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("Failed to create video:", error);
    res.status(500).json({ message: "Failed to create video" });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { videoLink, title, description } = req.body;
    const video = await VideoGallery.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (videoLink) video.videoLink = videoLink;
    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error("Failed to update video:", error);
    res.status(500).json({ message: "Failed to update video" });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await VideoGallery.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await video.deleteOne();

    res.status(200).json({ message: "Video deleted" });
  } catch (error) {
    console.error("Failed to delete video:", error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};

module.exports = {
  getVideoGallery,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
