import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Format a date string (e.g., "2025-10-07") into an ordinal formatted date like "7th October 2025"
 */
export function formatTitleDate(dateKey?: string): string {
  const d = dateKey ? new Date(dateKey) : new Date();
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

/**
 * Journal Entry Interface
 */
export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId;
  dateKey: string; // YYYY-MM-DD
  title: string;
  content: string; // HTML string or plain text from TipTap
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Journal Mongoose Schema
 */
const JournalSchema = new Schema<IJournal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: function (this: IJournal) {
        return formatTitleDate(this.dateKey);
      },
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup per user per date
JournalSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export const Journal: Model<IJournal> =
  mongoose.models.Journal || mongoose.model<IJournal>("Journal", JournalSchema);
