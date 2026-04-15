import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env");
}

// Global cache (prevents multiple connections in dev / hot reload)
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  // ✅ Already connected
  if (cached.conn) {
    console.log("🟢 MongoDB already connected (cached)");
    return cached.conn;
  }

  // ⏳ Create new connection
  if (!cached.promise) {
    console.log("🟡 Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("🟢 MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("🔴 MongoDB connection error:", err);
        throw err;
      });
  }

  // ⏳ Await connection
  cached.conn = await cached.promise;

  return cached.conn;
}