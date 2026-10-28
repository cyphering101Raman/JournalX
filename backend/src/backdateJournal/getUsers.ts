import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { User } from "../models/User";

async function fetchUsers() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI is missing from backend .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    const users = await User.find({}, "email _id createdAt").lean();

    console.log("\n========================================");
    console.log("Registered Users in MongoDB:");
    console.log("========================================");
    console.table(
      users.map((u) => ({
        userId: u._id.toString(),
        email: u.email,
        created: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
      }))
    );
    console.log("Copy the `userId` above to paste into your backdate form.\n");
  } catch (err) {
    console.error("❌ Error fetching users:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fetchUsers();
