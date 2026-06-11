const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const uploadRoot = path.join(__dirname, "..", "public", "uploads");
const maxImageSize = 6 * 1024 * 1024;
const allowedMimeTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const sanitizeSegment = (value, fallback) => {
  const sanitized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || fallback;
};

const getBaseUrl = (req) => {
  const configuredUrl = process.env.PUBLIC_API_URL || process.env.API_URL;
  const baseUrl = configuredUrl || `${req.protocol}://${req.get("host")}`;

  return baseUrl.replace(/\/v1\/?$/, "").replace(/\/$/, "");
};

const uploadImage = async (req, res) => {
  try {
    const { image, fileName, folder = "uploads" } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).send({ message: "Image file is required" });
    }

    const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!match) {
      return res.status(400).send({
        message: "Only JPEG, PNG, and WEBP image uploads are supported",
      });
    }

    const [, mimeType, base64Data] = match;
    const extension = allowedMimeTypes[mimeType];
    const buffer = Buffer.from(base64Data, "base64");

    if (!extension || buffer.length === 0) {
      return res.status(400).send({ message: "Invalid image upload" });
    }

    if (buffer.length > maxImageSize) {
      return res.status(400).send({
        message: "Image is too large. Maximum size is 6 MB.",
      });
    }

    const safeFolder = sanitizeSegment(folder, "uploads");
    const safeName = sanitizeSegment(
      path.parse(fileName || "image").name,
      "image",
    );
    const uniqueName = `${safeName}-${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}.${extension}`;
    const uploadDir = path.join(uploadRoot, safeFolder);
    const filePath = path.join(uploadDir, uniqueName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const relativeUrl = `/static/uploads/${safeFolder}/${uniqueName}`;
    const url = `${getBaseUrl(req)}${relativeUrl}`;

    res.status(201).send({
      url,
      secure_url: url,
      relativeUrl,
      public_id: `${safeFolder}/${path.parse(uniqueName).name}`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Failed to upload image",
    });
  }
};

module.exports = {
  uploadImage,
};
