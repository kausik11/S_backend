const Certificate = require("../models/Certificate");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (file) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "sbanerjee/certificates",
    resource_type: "auto",
  });

  return {
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  };
};

const getCertificates = async (_req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error("Failed to fetch certificate:", error);
    res.status(500).json({ message: "Failed to fetch certificate" });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { title, description, year } = req.body;

    if (!title || !description || !year) {
      return res.status(400).json({
        message: "Title, description, year, and image are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const parsedYear = Number(year);
    if (Number.isNaN(parsedYear)) {
      return res.status(400).json({ message: "Year must be a number" });
    }

    const { imageUrl, imagePublicId } = await uploadImage(req.file);

    const certificate = await Certificate.create({
      title,
      description,
      year: parsedYear,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error("Failed to create certificate:", error);
    res.status(500).json({ message: "Failed to create certificate" });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const { title, description, year } = req.body;
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (title) certificate.title = title;
    if (description) certificate.description = description;

    if (year !== undefined) {
      const parsedYear = Number(year);
      if (Number.isNaN(parsedYear)) {
        return res.status(400).json({ message: "Year must be a number" });
      }
      certificate.year = parsedYear;
    }

    if (req.file) {
      const { imageUrl, imagePublicId } = await uploadImage(req.file);

      if (certificate.imagePublicId) {
        await cloudinary.uploader.destroy(certificate.imagePublicId);
      }

      certificate.imageUrl = imageUrl;
      certificate.imagePublicId = imagePublicId;
    }

    await certificate.save();

    res.status(200).json(certificate);
  } catch (error) {
    console.error("Failed to update certificate:", error);
    res.status(500).json({ message: "Failed to update certificate" });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.imagePublicId) {
      await cloudinary.uploader.destroy(certificate.imagePublicId);
    }

    await certificate.deleteOne();

    res.status(200).json({ message: "Certificate deleted" });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    res.status(500).json({ message: "Failed to delete certificate" });
  }
};

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
