/**
 * Redis Client — Enterprise-grade caching layer with in-memory fallback
 *
 * Uses ioredis when REDIS_URL is configured, falls back to a simple
 * in-memory Map for development / single-instance deployments.
 *
 * Usage:
 *   const cache = require('./redis-client');
 *   await cache.get('key');
 *   await cache.set('key', value, ttlSeconds);
 *   await cache.del('key');
 */

let client = null;
let isRedisAvailable = false;

// ── In-memory fallback cache ───────────────────────────────────────────
const memoryStore = new Map();
const memoryTTLs = new Map();

function cleanupExpired() {
  const now = Date.now();
  for (const [key, expiry] of memoryTTLs.entries()) {
    if (now > expiry) {
      memoryStore.delete(key);
      memoryTTLs.delete(key);
    }
  }
}

// Cleanup expired keys every 30 seconds
setInterval(cleanupExpired, 30 * 1000).unref();

// ── Initialize Redis (lazy connect) ───────────────────────────────────
function getRedisClient() {
  if (client) return client;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log("Cache: No REDIS_URL configured — using in-memory fallback");
    return null;
  }

  try {
    const Redis = require("ioredis");
    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 10) {
          console.error(
            "Cache: Redis connection failed after 10 retries, using in-memory fallback",
          );
          isRedisAvailable = false;
          return null; // stop retrying
        }
        return Math.min(times * 200, 5000);
      },
      lazyConnect: true,
      enableReadyCheck: true,
      connectTimeout: 10000,
    });

    client.on("connect", () => {
      console.log("Cache: Redis connected");
      isRedisAvailable = true;
    });

    client.on("error", (err) => {
      console.error("Cache: Redis error:", err.message);
      isRedisAvailable = false;
    });

    client.on("close", () => {
      console.log("Cache: Redis connection closed");
      isRedisAvailable = false;
    });

    client.on("reconnecting", () => {
      console.log("Cache: Redis reconnecting...");
    });

    // Connect
    client.connect().catch((err) => {
      console.error("Cache: Redis initial connection failed:", err.message);
      isRedisAvailable = false;
    });

    return client;
  } catch (err) {
    console.error("Cache: Redis initialization failed:", err.message);
    return null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Get a cached value by key.
 * @param {string} key
 * @returns {Promise<any|null>} Parsed JSON value or null
 */
async function get(key) {
  const redis = getRedisClient();

  if (redis && isRedisAvailable) {
    try {
      const val = await redis.get(key);
      return val ? JSON.parse(val) : null;
    } catch (err) {
      console.error("Cache GET error:", err.message);
    }
  }

  // Fallback to memory
  const expiry = memoryTTLs.get(key);
  if (expiry && Date.now() > expiry) {
    memoryStore.delete(key);
    memoryTTLs.delete(key);
    return null;
  }
  const val = memoryStore.get(key);
  return val !== undefined ? val : null;
}

/**
 * Set a cached value.
 * @param {string} key
 * @param {any} value - Will be JSON.stringify'd
 * @param {number} [ttl=120] - TTL in seconds (default 2 minutes)
 * @returns {Promise<void>}
 */
async function set(key, value, ttl = 120) {
  const redis = getRedisClient();

  if (redis && isRedisAvailable) {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
      return;
    } catch (err) {
      console.error("Cache SET error:", err.message);
    }
  }

  // Fallback to memory
  memoryStore.set(key, value);
  memoryTTLs.set(key, Date.now() + ttl * 1000);
}

/**
 * Delete a cached key.
 * @param {string} key
 * @returns {Promise<void>}
 */
async function del(key) {
  const redis = getRedisClient();

  if (redis && isRedisAvailable) {
    try {
      await redis.del(key);
    } catch (err) {
      console.error("Cache DEL error:", err.message);
    }
  }

  // Always clean memory too (dual-layer safety)
  memoryStore.delete(key);
  memoryTTLs.delete(key);
}

/**
 * Delete all keys matching a pattern.
 * @param {string} pattern - e.g., "settings:*"
 * @returns {Promise<void>}
 */
async function delPattern(pattern) {
  const redis = getRedisClient();

  if (redis && isRedisAvailable) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error("Cache DEL pattern error:", err.message);
    }
  }

  // Memory fallback: match pattern (simple glob)
  const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  for (const key of memoryStore.keys()) {
    if (regex.test(key)) {
      memoryStore.delete(key);
      memoryTTLs.delete(key);
    }
  }
}

/**
 * Check if cache (Redis) is available.
 * @returns {boolean}
 */
function isAvailable() {
  return isRedisAvailable;
}

/**
 * Gracefully close Redis connection.
 */
async function quit() {
  if (client) {
    try {
      await client.quit();
    } catch {
      // ignore
    }
  }
}

module.exports = {
  get,
  set,
  del,
  delPattern,
  isAvailable,
  quit,
};
