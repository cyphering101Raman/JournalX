import { Pinecone } from "@pinecone-database/pinecone";

export class PineconeService {
  private static client: Pinecone | null = null;

  private static getClient(): Pinecone {
    if (!this.client) {
      const apiKey = process.env.PINECONE_API_KEY;
      if (!apiKey) {
        throw new Error("PINECONE_API_KEY is not defined in environment variables");
      }
      this.client = new Pinecone({ apiKey });
    }
    return this.client;
  }

  private static getIndex() {
    return this.getClient().Index(process.env.PINECONE_INDEX || "journalx");
  }

  /**
   * Upsert chunks into user's isolated namespace
   */
  static async upsertChunks(
    userId: string,
    journalId: string,
    dateKey: string,
    chunks: { chunkIndex: number; text: string; embedding: number[] }[]
  ): Promise<void> {
    if (!chunks.length) return;

    const index = this.getIndex().namespace(userId);

    const records = chunks.map((c) => ({
      id: `${journalId}#${c.chunkIndex}`,
      values: c.embedding,
      metadata: {
        journalId,
        dateKey,
        chunkIndex: c.chunkIndex,
        text: c.text,
      },
    }));

    await index.upsert({ records });
  }

  /**
   * Query top K chunks from user's namespace
   */
  static async querySimilar(userId: string, queryVector: number[], topK: number = 5) {
    const index = this.getIndex().namespace(userId);
    const result = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });
    return result.matches || [];
  }

  /**
   * Delete all chunks for a deleted journal entry
   */
  static async deleteJournalVectors(userId: string, journalId: string): Promise<void> {
    try {
      const index = this.getIndex().namespace(userId);
      await index.deleteMany({ filter: { journalId: { $eq: journalId } } });
    } catch (error) {
      console.error(`Failed to delete vectors for journal ${journalId}:`, error);
    }
  }
}
