import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  insights: {
    mood: string;
    summary: string;
    tags: string[];
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema = new Schema<IJournal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    content: {
      type: String,
      default: "",
    },
    insights: [
      {
        mood: { type: String },
        summary: { type: String },
        tags: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Journal: Model<IJournal> =
  mongoose.models.Journal || mongoose.model<IJournal>("Journal", JournalSchema);
