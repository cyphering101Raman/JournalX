import { Journal, IJournal, formatTitleDate } from "../models/Journal";
import { encryptText, decryptText } from "../utils/crypto";

export class JournalService {
  static async getJournalByDate(userId: string, dateKey: string): Promise<IJournal | null> {
    const journal = await Journal.findOne({ userId, dateKey });
    if (journal) {
      journal.content = decryptText(journal.content);
    }
    return journal;
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
        if (content !== undefined) existing.content = encryptText(content);
        const saved = await existing.save();
        saved.content = content ?? decryptText(saved.content);
        return saved;
      }
    }

    const key = dateKey && dateKey.trim().length > 0 ? dateKey : new Date().toISOString();
    const finalTitle = title && title.trim().length > 0 ? title : formatTitleDate(key);
    const encryptedContent = content !== undefined ? encryptText(content) : "";

    const saved = await Journal.findOneAndUpdate(
      { userId, dateKey: key },
      { title: finalTitle, content: encryptedContent },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (saved) {
      saved.content = content ?? decryptText(saved.content);
    }
    return saved as IJournal;
  }

  static async getAllJournals(userId: string): Promise<IJournal[]> {
    const journals = await Journal.find({ userId }).sort({ dateKey: -1 });
    journals.forEach((j) => {
      j.content = decryptText(j.content);
    });
    return journals;
  }

  static async deleteJournal(userId: string, journalId: string): Promise<boolean> {
    const result = await Journal.deleteOne({ _id: journalId, userId });
    return result.deletedCount > 0;
  }
}


