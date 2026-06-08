const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const otpSchema = new mongoose.Schema(
  {
    // The phone number or email that the OTP was sent to
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    // The type of verification (phone or email)
    type: {
      type: String,
      enum: ["phone", "email"],
      required: true,
    },
    // The OTP code (hashed for security)
    code: {
      type: String,
      required: true,
    },
    // Optional: Store user data for registration after verification
    userData: {
      name: String,
      email: String,
      password: String, // Will be hashed before storing
    },
    // Number of verification attempts (to prevent brute force)
    attempts: {
      type: Number,
      default: 0,
    },
    // Maximum attempts allowed
    maxAttempts: {
      type: Number,
      default: 5,
    },
    // Whether the OTP has been verified
    verified: {
      type: Boolean,
      default: false,
    },
    // Expiry time (OTP expires after this time)
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - automatically delete expired documents
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient lookups
otpSchema.index({ identifier: 1, type: 1 });

/**
 * Generate a secure random OTP code
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} - The generated OTP
 */
otpSchema.statics.generateCode = function (length = 6) {
  // Use crypto for secure random number generation
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  const code = min + (randomNumber % (max - min));
  return code.toString();
};

/**
 * Hash an OTP code for secure storage
 * @param {string} code - The plain OTP code
 * @returns {Promise<string>} - The hashed code
 */
otpSchema.statics.hashCode = async function (code) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(code, salt);
};

/**
 * Compare a plain OTP code with a hashed one
 * @param {string} plainCode - The plain OTP code
 * @param {string} hashedCode - The hashed OTP code
 * @returns {Promise<boolean>} - Whether they match
 */
otpSchema.statics.compareCode = async function (plainCode, hashedCode) {
  return bcrypt.compare(plainCode, hashedCode);
};

// Static method to create a new OTP
otpSchema.statics.createOtp = async function ({
  identifier,
  type,
  code,
  userData,
  expiresInMinutes = 10,
  hashCode = true, // Whether to hash the code before storing
}) {
  // Delete any existing OTPs for this identifier and type
  await this.deleteMany({ identifier, type });

  // Hash the code for security (optional, but recommended for production)
  const storedCode = hashCode ? await this.hashCode(code) : code;

  // Create new OTP with expiry
  const otp = new this({
    identifier,
    type,
    code: storedCode,
    userData,
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
  });

  return otp.save();
};

// Static method to verify OTP
otpSchema.statics.verifyOtp = async function ({
  identifier,
  type,
  code,
  isHashed = true, // Whether the stored code is hashed
}) {
  const otp = await this.findOne({
    identifier,
    type,
    expiresAt: { $gt: new Date() },
    verified: false,
  });

  if (!otp) {
    return { success: false, error: "OTP not found or expired" };
  }

  if (otp.attempts >= otp.maxAttempts) {
    return { success: false, error: "Maximum verification attempts exceeded" };
  }

  // Increment attempts
  otp.attempts += 1;

  // Compare the codes
  let isMatch;
  if (isHashed) {
    isMatch = await this.compareCode(code, otp.code);
  } else {
    isMatch = otp.code === code;
  }

  if (!isMatch) {
    await otp.save();
    return {
      success: false,
      error: `Invalid OTP. ${
        otp.maxAttempts - otp.attempts
      } attempts remaining`,
    };
  }

  // Mark as verified
  otp.verified = true;
  await otp.save();

  return { success: true, otp };
};

module.exports = mongoose.model("Otp", otpSchema);
