import { Journal, IJournal, formatTitleDate } from "../models/Journal";

export class JournalService {
  static async getJournalByDate(userId: string, dateKey: string): Promise<IJournal | null> {
    return Journal.findOne({ userId, dateKey });
  }

  static async saveJournal(
    userId: string,
    journalId?: string,
    dateKey?: string,
    title?: string,
    content?: string
  ): Promise<IJournal> {
    if (journalId) {
      const existing = await Journal.findOne({ _id: journalId, userId });
      if (existing) {
        if (title !== undefined) existing.title = title;
        if (content !== undefined) existing.content = content;
        return existing.save();
      }
    }

    const key = dateKey && dateKey.trim().length > 0 ? dateKey : new Date().toISOString();
    const finalTitle = title && title.trim().length > 0 ? title : formatTitleDate(key);

    return Journal.findOneAndUpdate(
      { userId, dateKey: key },
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
