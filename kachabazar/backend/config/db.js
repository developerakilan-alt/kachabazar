require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool — handle concurrent requests efficiently
      maxPoolSize: 50,
      minPoolSize: 5,
      // Timeout settings
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Retry
      retryWrites: true,
      retryReads: true,
      // Heartbeat
      heartbeatFrequencyMS: 10000,
    });
    console.log("mongodb connection success!");

    // Monitor connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected successfully.");
    });
  } catch (err) {
    console.error("mongodb connection failed!", err.message);
    // In production, exit so the process manager can restart
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing MongoDB connection...`);
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = {
  connectDB,
};
