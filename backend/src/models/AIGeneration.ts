import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAIGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  promptType: string;
  response: string;
  createdAt: Date;
}

const AIGenerationSchema = new Schema<IAIGeneration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    promptType: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export const AIGeneration: Model<IAIGeneration> =
  mongoose.models.AIGeneration || mongoose.model<IAIGeneration>("AIGeneration", AIGenerationSchema);
