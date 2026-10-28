import { Journal, IJournal, formatTitleDate } from "../models/Journal";
import { encryptText, decryptText } from "../utils/crypto";
import { sanitizeHtml, chunkText } from "../utils/chunker";
import { EmbeddingService } from "./embedding.service";
import { PineconeService } from "./pinecone.service";

export class JournalService {
  private static async syncJournalVectors(
    userId: string,
    journalId: string,
    dateKey: string,
    rawContent: string
  ): Promise<void> {
    try {
      const plainText = sanitizeHtml(rawContent);
      if (!plainText) return;

      const chunks = chunkText(plainText);
      if (!chunks.length) return;

      const chunksWithEmbeddings = await Promise.all(
        chunks.map(async (c) => ({
          chunkIndex: c.chunkIndex,
          text: c.text,
          embedding: await EmbeddingService.embedChunk(c.text),
        }))
      );

      console.log("========================================")
      console.log("Chunks with embeddings:", chunksWithEmbeddings);
      console.log("========================================")

      await PineconeService.upsertChunks(
        userId,
        journalId,
        dateKey,
        chunksWithEmbeddings
      );
    } catch (err) {
      console.error("Vector sync failed:", err);
    }
  }

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

        if (content !== undefined) {
          this.syncJournalVectors(userId, (saved._id as any).toString(), saved.dateKey, content);
        }
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
      if (content !== undefined) {
        this.syncJournalVectors(userId, (saved._id as any).toString(), saved.dateKey, content);
      }
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
    if (result.deletedCount > 0) {
      PineconeService.deleteJournalVectors(userId, journalId).catch((err) =>
        console.error("Failed to delete vectors:", err)
      );
      return true;
    }
    return false;
  }
}

