import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

export class EmbeddingService {
  private static getModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-embedding-2" });
  }

  /**
   * Embed a document chunk for vector indexing
   */
  static async embedChunk(text: string): Promise<number[]> {
    const model = this.getModel();
    const result = await model.embedContent({
      content: { role: "user", parts: [{ text }] },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  }

  /**
   * Embed a user query for similarity search
   */
  static async embedQuery(query: string): Promise<number[]> {
    const model = this.getModel();
    const result = await model.embedContent({
      content: { role: "user", parts: [{ text: query }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  }
}
