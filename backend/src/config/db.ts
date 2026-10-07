import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("❌MONGODB_URI environment variable is not defined");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌[Database Error] Failed to connect:`, error);
    process.exit(1);
  }
};
