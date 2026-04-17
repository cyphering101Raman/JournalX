import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAIGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  type: "SUMMARY";
  startDate: string;
  endDate: string;
  output: {
    summary: string;
    patterns: string[];
    overallMood: string;
  };
  createdAt: Date;
}

const AIGenerationSchema = new Schema<IAIGeneration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["SUMMARY"],
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    output: {
      summary: { type: String, required: true },
      patterns: [{ type: String }],
      overallMood: { type: String },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIGeneration: Model<IAIGeneration> =
  mongoose.models.AIGeneration ||
  mongoose.model<IAIGeneration>("AIGeneration", AIGenerationSchema);
