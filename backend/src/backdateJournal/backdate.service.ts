import { Journal, IJournal, formatTitleDate } from "../models/Journal";
import { encryptText } from "../utils/crypto";

export class BackdateService {
  static async saveJournal(
    userId: string,
    dateKey: string,
    title?: string,
    content?: string
  ): Promise<IJournal> {
    if (!userId) {
      throw new Error("userId is required");
    }

    const key = dateKey && dateKey.trim().length > 0 ? dateKey : new Date().toISOString();
    const finalTitle = title && title.trim().length > 0 ? title : formatTitleDate(key);
    const encryptedContent = content !== undefined ? encryptText(content) : "";
    const targetDate = new Date(key);

    const saved = await Journal.findOneAndUpdate(
      { userId, dateKey: key },
      {
        title: finalTitle,
        content: encryptedContent,
        createdAt: targetDate,
        updatedAt: targetDate,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, timestamps: false }
    );

    return saved as IJournal;
  }
}
