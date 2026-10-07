import { Journal, IJournal, formatTitleDate } from "../models/Journal";

export class JournalService {
  static async getJournalByDate(userId: string, dateKey: string): Promise<IJournal | null> {
    return Journal.findOne({ userId, dateKey });
  }

  static async saveJournal(
    userId: string,
    dateKey: string,
    title?: string,
    content?: string
  ): Promise<IJournal> {
    const finalTitle = title && title.trim().length > 0 ? title : formatTitleDate(dateKey);

    return Journal.findOneAndUpdate(
      { userId, dateKey },
      { title: finalTitle, content: content ?? "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  static async getAllJournals(userId: string): Promise<IJournal[]> {
    return Journal.find({ userId }).sort({ dateKey: -1 });
  }

  static async deleteJournal(userId: string, journalId: string): Promise<boolean> {
    const result = await Journal.deleteOne({ _id: journalId, userId });
    return result.deletedCount > 0;
  }
}
