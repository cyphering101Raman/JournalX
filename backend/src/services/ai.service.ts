/**
 * @deprecated This service is deprecated and no longer actively used in production.
 * 
 * Original Purpose:
 * Provided basic, single-entry AI analysis by sending raw journal text to Gemini 2.5 Flash
 * to extract emotional tone, general reflections, and suggested action items.
 * 
 * Superseded by:
 * The vector-based RAG reflection pipeline (RAGService), which performs grounded, 
 * multi-entry retrieval with date-specific citations.
 */


import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIUsage } from "../models/AIUsage";
import { AIGeneration } from "../models/AIGeneration";

export class AIService {
  private static getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });
  }

  static async generateInsight(userId: string, content: string): Promise<string> {
    const model = this.getGeminiModel();
    const prompt = `Analyze this journal entry and provide empathetic, constructive insights, emotional tone analysis, and action items:\n\n${content}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    await AIGeneration.create({
      userId,
      promptType: "insight",
      response: responseText,
    });

    return responseText;
  }
}
