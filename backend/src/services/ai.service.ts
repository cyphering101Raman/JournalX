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
