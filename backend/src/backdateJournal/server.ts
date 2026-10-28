import dotenv from "dotenv";
import path from "path";

// Load backend .env from parent backend directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import backdateRoutes from "./backdate.routes";

const app = express();
const PORT = process.env.BACKDATE_PORT || 5005;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount isolated route
app.use("/backdate", backdateRoutes);

// Simple healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "backdate-runner" });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI is missing from backend .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ [Backdate Runner] Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 [Backdate Runner] Standalone server running at http://localhost:${PORT}`);
      console.log(`👉 POST http://localhost:${PORT}/backdate`);
    });
  } catch (err) {
    console.error("❌ [Backdate Runner] Connection error:", err);
    process.exit(1);
  }
}

start();
