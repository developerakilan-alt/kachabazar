/**
 * Settings Cache — loads globalSetting from the database once,
 * caches it in memory, and refreshes every 2 minutes.
 *
 * All services (email sender, SMS sender, controllers) should call
 * getSettings() instead of reading process.env for configurable values.
 *
 * Sensitive fields (passwords, API keys) are stored AES-256-CBC encrypted
 * in the database and decrypted transparently here.
 */

const crypto = require("crypto");
const Setting = require("../models/Setting");

// ── encryption helpers (mirrors config/auth.js) ────────────────────────
const secretKey = process.env.ENCRYPT_PASSWORD || "";
const encKey = crypto.createHash("sha256").update(secretKey).digest();

function encrypt(plainText) {
  if (!plainText || !secretKey) return plainText;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encKey, iv);
  let enc = cipher.update(String(plainText), "utf8", "hex");
  enc += cipher.final("hex");
  return `enc:${iv.toString("hex")}:${enc}`;
}

function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== "string") return cipherText;
  if (!cipherText.startsWith("enc:")) return cipherText; // not encrypted
  try {
    const parts = cipherText.split(":");
    const iv = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv("aes-256-cbc", encKey, iv);
    let dec = decipher.update(encrypted, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  } catch {
    return cipherText; // return as-is if decryption fails
  }
}

// ── fields that must be encrypted in the database ──────────────────────
const SENSITIVE_FIELDS = [
  "email_pass",
  "twilio_account_sid",
  "twilio_auth_token",
  "twilio_messaging_service_sid",
  "messagebird_api_key",
  "vonage_api_key",
  "vonage_api_secret",
  "aws_access_key_id",
  "aws_secret_access_key",
];

/**
 * Encrypt sensitive fields before saving to DB.
 * Called from settingController updateGlobalSetting / addGlobalSetting.
 */
function encryptSensitiveFields(settingObj) {
  const copy = { ...settingObj };
  for (const field of SENSITIVE_FIELDS) {
    if (copy[field] && !String(copy[field]).startsWith("enc:")) {
      copy[field] = encrypt(copy[field]);
    }
  }
  return copy;
}

/**
 * Decrypt sensitive fields when reading from DB.
 */
function decryptSensitiveFields(settingObj) {
  if (!settingObj) return settingObj;
  const copy = { ...settingObj };
  for (const field of SENSITIVE_FIELDS) {
    if (copy[field]) {
      copy[field] = decrypt(copy[field]);
    }
  }
  return copy;
}

// ── Redis + in-memory cache ────────────────────────────────────────────
const cache = require("./redis-client");
let cachedSettings = null;
let lastFetch = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes
const CACHE_KEY = "settings:global";
const CACHE_TTL_SECONDS = 120; // 2 min for Redis

/**
 * Get global settings, with DB values taking priority over process.env.
 * Returns a plain object (no Mongoose doc).
 * Uses Redis as primary cache with in-memory L1 fallback.
 */
async function getSettings() {
  const now = Date.now();

  // L1: in-process memory (fastest)
  if (cachedSettings && now - lastFetch < CACHE_TTL) {
    return cachedSettings;
  }

  // L2: Redis (shared across instances)
  try {
    const redisHit = await cache.get(CACHE_KEY);
    if (redisHit) {
      cachedSettings = redisHit;
      lastFetch = now;
      return cachedSettings;
    }
  } catch {
    // Redis unavailable, fall through to DB
  }

  try {
    const doc = await Setting.findOne({ name: "globalSetting" }).lean();
    const raw = doc?.setting || {};
    const settings = decryptSensitiveFields(raw);

    // Build a merged object: DB settings with env/fallback overrides
    // Spread DB settings FIRST so explicit defaults below take priority
    cachedSettings = {
      // ── pass through other DB fields as-is ──
      ...settings,

      // ── Email Config ──
      email_service: settings.email_service || process.env.SERVICE || "gmail",
      email_host: settings.email_host || process.env.HOST || "smtp.gmail.com",
      email_port: settings.email_port || process.env.EMAIL_PORT || "465",
      email_user: settings.email_user || process.env.EMAIL_USER || "",
      email_pass: settings.email_pass || process.env.EMAIL_PASS || "",

      // ── SMS Config ──
      sms_provider: settings.sms_provider || process.env.SMS_PROVIDER || "mock",
      sms_sender_id:
        settings.sms_sender_id || process.env.SMS_SENDER_ID || "hautecouturejewellery",
      app_name: settings.app_name || process.env.APP_NAME || "hautecouturejewellery",

      // Twilio
      twilio_account_sid:
        settings.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID || "",
      twilio_auth_token:
        settings.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN || "",
      twilio_phone_number:
        settings.twilio_phone_number || process.env.TWILIO_PHONE_NUMBER || "",
      twilio_messaging_service_sid:
        settings.twilio_messaging_service_sid ||
        process.env.TWILIO_MESSAGING_SERVICE_SID ||
        "",

      // MessageBird
      messagebird_api_key:
        settings.messagebird_api_key || process.env.MESSAGEBIRD_API_KEY || "",

      // AWS SNS
      aws_access_key_id:
        settings.aws_access_key_id || process.env.AWS_ACCESS_KEY_ID || "",
      aws_secret_access_key:
        settings.aws_secret_access_key ||
        process.env.AWS_SECRET_ACCESS_KEY ||
        "",
      aws_region: settings.aws_region || process.env.AWS_REGION || "us-east-1",

      // Vonage
      vonage_api_key:
        settings.vonage_api_key || process.env.VONAGE_API_KEY || "",
      vonage_api_secret:
        settings.vonage_api_secret || process.env.VONAGE_API_SECRET || "",

      // ── Application URLs ──
      store_url:
        settings.store_url || process.env.STORE_URL || "http://localhost:3000",
      admin_url:
        settings.admin_url || process.env.ADMIN_URL || "http://localhost:4100",

      // ── Stripe (backend env fallback) ──
      stripe_payment_description:
        settings.stripe_payment_description ||
        process.env.STRIPE_PAYMENT_DESCRIPTION ||
        "",
      max_amount: settings.max_amount || process.env.MAX_AMOUNT || "10000",
      min_amount: settings.min_amount || process.env.MIN_AMOUNT || "10",
    };

    lastFetch = now;

    // Write back to Redis for other instances
    try {
      await cache.set(CACHE_KEY, cachedSettings, CACHE_TTL_SECONDS);
    } catch {
      // Redis write failed, local cache still valid
    }
  } catch (err) {
    console.error(
      "Settings cache: DB read failed, using env fallback",
      err.message,
    );
    if (!cachedSettings) {
      // First time, no cache — build from env only
      cachedSettings = {
        email_service: process.env.SERVICE || "gmail",
        email_host: process.env.HOST || "smtp.gmail.com",
        email_port: process.env.EMAIL_PORT || "465",
        email_user: process.env.EMAIL_USER || "",
        email_pass: process.env.EMAIL_PASS || "",
        sms_provider: process.env.SMS_PROVIDER || "mock",
        sms_sender_id: process.env.SMS_SENDER_ID || "hautecouturejewellery",
        app_name: process.env.APP_NAME || "hautecouturejewellery",
        twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || "",
        twilio_auth_token: process.env.TWILIO_AUTH_TOKEN || "",
        twilio_phone_number: process.env.TWILIO_PHONE_NUMBER || "",
        twilio_messaging_service_sid:
          process.env.TWILIO_MESSAGING_SERVICE_SID || "",
        messagebird_api_key: process.env.MESSAGEBIRD_API_KEY || "",
        aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || "",
        aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || "",
        aws_region: process.env.AWS_REGION || "us-east-1",
        vonage_api_key: process.env.VONAGE_API_KEY || "",
        vonage_api_secret: process.env.VONAGE_API_SECRET || "",
        store_url: process.env.STORE_URL || "http://localhost:3000",
        admin_url: process.env.ADMIN_URL || "http://localhost:4100",
        stripe_payment_description:
          process.env.STRIPE_PAYMENT_DESCRIPTION || "",
        max_amount: process.env.MAX_AMOUNT || "10000",
        min_amount: process.env.MIN_AMOUNT || "10",
      };
      lastFetch = now;
    }
  }

  return cachedSettings;
}

/**
 * Invalidate the cache so the next getSettings() re-reads from DB.
 * Clears both in-memory and Redis caches.
 * Call this after updating globalSetting.
 */
async function invalidateSettingsCache() {
  cachedSettings = null;
  lastFetch = 0;
  try {
    await cache.del(CACHE_KEY);
  } catch {
    // Redis unavailable, local cache already cleared
  }
}

module.exports = {
  getSettings,
  invalidateSettingsCache,
  encryptSensitiveFields,
  decryptSensitiveFields,
  encrypt,
  decrypt,
  SENSITIVE_FIELDS,
};
