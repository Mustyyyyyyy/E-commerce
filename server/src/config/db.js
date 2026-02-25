const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  const uri = env.MONGO_URI; 
  if (!uri) throw new Error("MONGO_URI is missing in env");

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => console.log("✅ MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err));
  mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  return mongoose.connection;
}

module.exports = connectDB;