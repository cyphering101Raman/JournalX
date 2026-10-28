import { GoogleGenerativeAI } from "@google/generative-ai";
import { EmbeddingService } from "./embedding.service";
import { PineconeService } from "./pinecone.service";
import { AIGeneration } from "../models/AIGeneration";

export interface RagResult {
  answer: string;
  references: string[];
}

export class RagService {
  private static getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  static async query(userId: string, queryText: string): Promise<RagResult> {
    const queryVector = await EmbeddingService.embedQuery(queryText);
    const matches = await PineconeService.querySimilar(userId, queryVector, 5);

    if (!matches || matches.length === 0) {
      return {
        answer: "I couldn't find any relevant journal entries to answer your question.",
        references: [],
      };
    }

    const contextBlocks = matches
      .map((m) => {
        const metadata = m.metadata as { dateKey?: string; text?: string } | undefined;
        const dateKey = metadata?.dateKey || "Unknown Date";
        const text = metadata?.text || "";
        return `[Entry Date: ${dateKey}]\n${text}`;
      })
      .filter((block) => block.trim().length > 0)
      .join("\n\n---\n\n");

    if (!contextBlocks.trim()) {
      return {
        answer: "I couldn't find any relevant journal entries to answer your question.",
        references: [],
      };
    }

    const prompt = `You are an empathetic, highly reflective AI journaling companion for JournalX.
Answer the user's inquiry strictly based on the journal context excerpts below.
Always cite the specific dates of the entries you reference.
If the context does not contain enough information to answer, say so honestly without making up details.

Journal Context:
----------------
${contextBlocks}
----------------

User Question: ${queryText}
`;

    const model = this.getGeminiModel();
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    const references = Array.from(
      new Set(
        matches
          .map((m) => (m.metadata as { dateKey?: string } | undefined)?.dateKey)
          .filter((d): d is string => Boolean(d))
      )
    );

    await AIGeneration.create({
      userId,
      promptType: "rag_query",
      response: answer,
    }).catch((err) => console.error("Failed to log AIGeneration:", err));

    return {
      answer,
      references,
    };
  }
}
