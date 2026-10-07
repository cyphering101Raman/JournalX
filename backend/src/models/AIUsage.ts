import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAIUsage extends Document {
  userId: mongoose.Types.ObjectId;
  dateKey: string;
  count: number;
}

const AIUsageSchema = new Schema<IAIUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dateKey: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

AIUsageSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export const AIUsage: Model<IAIUsage> =
  mongoose.models.AIUsage || mongoose.model<IAIUsage>("AIUsage", AIUsageSchema);
