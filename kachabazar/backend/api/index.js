require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const reviewRoutes = require("../routes/reviewRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const themeRoutes = require("../routes/themeRoutes");
const storeLayoutRoutes = require("../routes/storeLayoutRoutes");
const deliveryBoyRoutes = require("../routes/deliveryBoyRoutes");
const deliveryRoutes = require("../routes/deliveryRoutes");
const trackingRoutes = require("../routes/trackingRoutes");
const campaignRoutes = require("../routes/campaignRoutes");
const uploadRoutes = require("../routes/uploadRoutes");
const shiprocketRoutes = require("../routes/shiprocketRoutes");
const { isAuth, isAdmin } = require("../config/auth");

connectDB();
const app = express();

// ── Trust proxy (required for rate limiting behind reverse proxy / load balancer) ──
app.set("trust proxy", 1);

// ── Security Headers ──
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ── CORS — whitelist allowed origins ──
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 86400, // Cache preflight for 24h
  }),
);

// ── Body Parser ──
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Request Logging ──
// Production: Apache combined format — structured for log aggregation (ELK, CloudWatch, etc.)
// Development: Short colored format for readability
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    // Skip health check logs to reduce noise
    skip: (req) => req.url === "/health" || req.url === "/",
  }),
);

// ── Global Rate Limiter (prevent DDoS / abuse) ──
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "production" ? 200 : 1000, // requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});
app.use(globalLimiter);

// ── Health Check ──
app.get("/", (req, res) => {
  res.send("App works properly!");
});

app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
    },
  });
});

// ── Public Routes (store front) ──
app.use("/v1/products/", productRoutes);
app.use("/v1/category/", categoryRoutes);
app.use("/v1/coupon/", couponRoutes);
app.use("/v1/customer/", customerRoutes);
app.use("/v1/attributes/", attributeRoutes);
app.use("/v1/setting/", settingRoutes);
app.use("/v1/language/", languageRoutes);
app.use("/v1/theme/", themeRoutes);
app.use("/v1/store-layout/", storeLayoutRoutes);
app.use("/v1/tracking/", trackingRoutes);
app.use("/v1/campaign/", campaignRoutes);

// ── Guest order routes (no auth required) ──
const { validateGuestOrder } = require("../middleware/validators");
app.post("/v1/order/add/guest", validateGuestOrder, require("../controller/customerOrderController").addGuestOrder);

// ── Authenticated Routes ──
app.use("/v1/reviews/", isAuth, reviewRoutes);
app.use("/v1/order/", customerOrderRoutes);
app.use("/v1/currency/", isAuth, currencyRoutes);
app.use("/v1/notification/", isAuth, notificationRoutes);
app.use("/v1/customer-tracking/", isAuth, trackingRoutes);

// ── Admin Routes ──
app.use("/v1/admin/", adminRoutes);
app.use("/v1/orders/", isAuth, isAdmin, orderRoutes);
app.use("/v1/uploads/", uploadRoutes);

// ── ShipRocket Routes ──
app.use("/v1/shiprocket/", shiprocketRoutes);

// ── Courier Webhook (ShipRocket callback — path avoids blocked keywords) ──
app.use("/v1/webhooks/", require("../routes/webhookRoutes"));

// ── Delivery Boy Routes ──
const { loginDeliveryBoy } = require("../controller/deliveryBoyController");
app.post("/v1/delivery-boy/login", loginDeliveryBoy);
app.use("/v1/delivery-boy/", isAuth, isAdmin, deliveryBoyRoutes);
app.use("/v1/delivery/", deliveryRoutes);

// ── URL Fix Middleware: replace localhost URLs with public URL ──
const publicUrl = (process.env.PUBLIC_API_URL || "").replace(/\/+$/, "");
const localhostPattern = /https?:\/\/localhost:\d+(?=\/|"|'|,|})/g;
if (publicUrl) {
  app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (body && typeof body === "object") {
        const str = JSON.stringify(body);
        if (localhostPattern.test(str)) {
          body = JSON.parse(str.replace(localhostPattern, publicUrl));
        }
      }
      return originalJson(body);
    };
    next();
  });
}

// ── Static Files ──
app.use(
  "/static",
  express.static("public", {
    maxAge: "1d",
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Don't leak stack traces in production
  const isDev = process.env.NODE_ENV !== "production";
  console.error("Unhandled error:", err.message);
  if (isDev) console.error(err.stack);

  res.status(err.status || 500).json({
    message: isDev ? err.message : "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  // Start Shiprocket background sync
  try {
    require("../lib/shiprocket/sync").startSync();
  } catch (e) {
    console.error("Failed to start Shiprocket sync:", e.message);
  }
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Stop Shiprocket sync
  try {
    require("../lib/shiprocket/sync").stopSync();
  } catch {
    // ignore
  }

  // Close Redis connection
  try {
    const cache = require("../lib/redis-client");
    await cache.quit();
    console.log("Redis connection closed.");
  } catch {
    // ignore
  }

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle uncaught errors to prevent crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Give time for logging, then exit
  setTimeout(() => process.exit(1), 1000);
});
