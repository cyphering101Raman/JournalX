import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAIUsage extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // Format: "YYYY-MM-DD"
  insightCount: number;
}

const AIUsageSchema = new Schema<IAIUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    insightCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find usage for a specific user on a specific day
AIUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export const AIUsage: Model<IAIUsage> =
  mongoose.models.AIUsage || mongoose.model<IAIUsage>("AIUsage", AIUsageSchema);
