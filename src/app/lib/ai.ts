import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function generateJournalInsight(content: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze the following journal entry and provide insights in JSON format.
    
    STRICT RULES:
    1. mood: Exactly 1 word only (e.g., Happy, Stressed, Focused, Anxious). Non-negotiable.
    2. summary: 2-3 lines total. Keep it short and sharp.
    3. tags: 3-5 keywords max.
    
    Journal Content:
    """
    ${content}
    """
    
    Response MUST be valid JSON in this format:
    {
      "mood": "SingleWord",
      "summary": "2-3 lines of summary...",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (Gemini sometimes wraps in ```json ... ```)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response: No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validation of strict rules
    if (parsed.mood && parsed.mood.split(" ").length > 1) {
      parsed.mood = parsed.mood.split(" ")[0]; // Force 1 word if LLM fails
    }

    return {
      mood: parsed.mood || "Neutral",
      summary: parsed.summary || "No summary available.",
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("AI Insight Error:", error);
    throw new Error("Failed to generate AI insights");
  }
}
