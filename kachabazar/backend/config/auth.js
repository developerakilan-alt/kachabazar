require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_LIFETIME || "15m" }, // short-lived
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_LIFETIME || "7d" }, // longer-lived
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" },
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Authorization header missing or malformed",
      });
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Don't log token errors in production (could leak info)
    if (process.env.NODE_ENV !== "production") {
      console.log("Auth error:", err.message);
    }

    res.status(401).send({
      message:
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        message: "Authentication required",
      });
    }
    const admin = await Admin.findById(req.user._id);
    if (
      admin &&
      admin.status === "active" &&
      ["admin", "super admin", "ceo", "manager"].includes(admin.role)
    ) {
      req.admin = admin;
      next();
    } else {
      res.status(403).send({
        message: "Access denied. Admin privileges required.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Authorization check failed",
    });
  }
};

const secretKey = process.env.ENCRYPT_PASSWORD || "856305f1a5b7ba87b8448e69b3bb7a4631c23f0afa2ca5331fa1373f7e372345";

// Ensure the secret key is exactly 32 bytes (256 bits)
const key = crypto.createHash("sha256").update(secretKey).digest();

// Helper function to encrypt data — generates a unique IV per call
const handleEncryptData = (data) => {
  // Ensure the input is a string or convert it to a string
  const dataToEncrypt = typeof data === "string" ? data : JSON.stringify(data);

  // Generate a fresh IV for every encryption operation (required for AES-CBC security)
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(dataToEncrypt, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return {
    data: encryptedData,
    iv: iv.toString("hex"),
  };
};

module.exports = {
  isAuth,
  isAdmin,
  signInToken,
  tokenForVerify,
  handleEncryptData,
  generateAccessToken,
  generateRefreshToken,
};
